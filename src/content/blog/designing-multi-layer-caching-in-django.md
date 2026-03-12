---
title: Designing a Multi-Layer Caching Strategy in Django with Redis
description: Database queries are the primary performance bottleneck in many Django applications. In this guide, we build a practical multi-layer caching strategy using Redis. Starting with a baseline Django API, we measure response times, introduce caching step-by-step, and analyze how each caching layer improves performance while addressing cache invalidation, data consistency, and production pitfalls.
publishedDate: 2026-03-10
updatedDate: 2026-03-10
author: Bibek Joshi
tags:
  - Django
  - Django REST Framework
  - Redis
  - Caching
  - Backend Performance
  - Python
  - Web Performance
category: Backend Engineering
featuredImage: ./images/multi-layer-caching-in-django.png
draft: false
---

## Table of Contents

1. [The Performance Problem in Django APIs](#the-performance-problem)
2. [Identifying the Right Caching Layer in Django Applications](#identifying-the-right-caching-layer-in-django-applications)
3. [Implementing Per-View Caching in Django](#implementing-per-view-caching-in-django)
4. [Cache Invalidation: Keeping Cached Data Correct](#cache-invalidation-keeping-cached-data-correct)
5. [Low-Level Caching: Caching Querysets and Expensive Operations](#low-level-caching-caching-querysets-and-expensive-operations)
6. [Building a Multi-Layer Caching Strategy](#building-a-multi-layer-caching-strategy)
7. [Conclusion and Best Practices](#conclusion-and-best-practices)


## <a id="the-performance-problem"></a>1. The Performance Problem in Django APIs

Before introducing caching, it is important to first understand why caching becomes necessary in Django applications. Many performance problems in backend systems originate from repeated database queries, heavy serialization, and inefficient data access patterns.

To demonstrate this, we will start with a **simple Django REST Framework API endpoint** and measure its response time without any caching.

### Setting Up the Demo Project

First, create a minimal Django project with Django REST Framework installed.

```bash
pip install django djangorestframework
django-admin startproject caching_demo
cd caching_demo
python manage.py startapp products
```

Register the app and DRF inside `settings.py`.

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "products",
]
```

Add the pagination configuration in `settings.py`.

```python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
}
```

Run initial migrations:

```bash
python manage.py migrate
```

### Creating a Data Model

To simulate a realistic API workload, we will create a simple `Product` model with multiple fields.

```python
# products/models.py

from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    description = models.TextField()
    category = models.CharField(max_length=100)
    stock = models.IntegerField()
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

Apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Creating a Serializer

Next, we create a serializer to convert the model instances into JSON responses.

```python
# products/serializers.py

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
```

### Creating a Slow API Endpoint

Now we create an API endpoint that returns a list of products.
To simulate a realistic performance issue, we intentionally introduce a **large query and serialization workload**.

```python
# products/views.py

# products/views.py

from rest_framework.generics import ListAPIView
from .models import Product
from .serializers import ProductSerializer


class ProductListView(ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
```

Add the URL route:

```python
# products/urls.py

from django.urls import path
from .views import ProductListView

urlpatterns = [
    path("products/", ProductListView.as_view()),
]
```

Include the URLs in the project:

```python
# caching_demo/urls.py

from django.urls import path, include

urlpatterns = [
    path("api/", include("products.urls")),
]
```

### Populating the Database

To simulate a real dataset, populate the database with several thousand records.

```bash
python manage.py shell
```

```python
from products.models import Product

for i in range(10000):
    Product.objects.create(
        name=f"Product {i}",
        price=10 + i,
        description="Example product description",
        category="electronics",
        stock=100,
        rating=4.5
    )
```

This dataset allows us to observe the **impact of database queries and serialization overhead**.

### Measuring the Baseline Response Time

Now run the development server:

```bash
python manage.py runserver
```

Test the endpoint:

```
http://localhost:8000/api/products/
```

You can measure response time using `curl`.

```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/products/
```

Or simply inspect the **network timing in your browser developer tools**.

Every request forces Django to:

1. Query the database
2. Create model instances
3. Serialize objects into JSON
4. Send the response

Even with pagination enabled, the API still executes the same database query and serialization process for every request.

For example, the first page of a product listing (/api/products/?page=1) is often the most frequently accessed page in an application. If hundreds or thousands of users request this endpoint, Django will repeatedly perform the same query and serialization work even though the underlying data rarely changes.

This is precisely the type of problem that caching is designed to solve.

### Key Takeaway

At this point, our API works correctly, but it is inefficient.
The same expensive query is executed on every request, even though the data changes infrequently.

In the next section, we will introduce the first optimization layer and explore **how caching can eliminate redundant work and significantly reduce response times**.

---

## <a id="identifying-the-right-caching-layer-in-django-applications"></a>2. Identifying the Right Caching Layer in Django Applications

When developers think about caching in Django, they usually jump directly to **Redis**.
However, caching is most effective when it is designed as a **layered strategy**, where different parts of the system cache data at different levels.

Before implementing Redis caching inside Django, it is important to understand **where caching can occur in the request lifecycle**.

### Request Flow Without Caching

A typical API request in a Django REST Framework application looks like this:

```
Client Request
      │
Django View
      │
ORM Query
      │
Database
      │
Serializer
      │
JSON Response
```

Every request goes through the entire stack, even if the data has not changed.

For frequently accessed endpoints such as:

```
GET /api/products/?page=1
```

this means Django repeatedly performs the same database query and serialization work.

### The Multi-Layer Caching Model

A more efficient system introduces caching at multiple layers:

```
Browser Cache
      │
CDN / Edge Cache
      │
Reverse Proxy Cache (Nginx)
      │
Application Cache (Django + Redis)
      │
Database
```

Each layer reduces load on the layer below it.

| Layer                    | Purpose                                              | Typical Usage              |
| ------------------------ | ---------------------------------------------------- | -------------------------- |
| Browser Cache            | Prevent repeated requests from the same client       | Static resources           |
| CDN / Edge Cache         | Serve cached responses geographically close to users | Public APIs, static assets |
| Reverse Proxy Cache      | Cache responses at the server edge                   | High-traffic endpoints     |
| Django Application Cache | Cache expensive queries or responses                 | Dynamic API data           |

For our demonstration, we will focus on the **application caching layer**, implemented with Redis.

### Why Application-Level Caching Is Still Necessary

External caches such as CDNs or reverse proxies are powerful, but they are not always suitable for API responses.

Common limitations include:

- APIs may contain **user-specific data**
- Authorization headers can prevent CDN caching
- Dynamic query parameters (pagination, filters) complicate caching rules

Because of this, many backend systems implement caching **inside the application layer**, where the developer has full control over:

- cache keys
- expiration time (TTL)
- invalidation logic
- what data should or should not be cached

### What Should Actually Be Cached?

Caching should be applied selectively. The most effective candidates are endpoints that are:

- Frequently requested
- Expensive to compute
- Updated relatively infrequently

In our demo API, the endpoint:

```
GET /api/products/?page=1
```

is a strong candidate because:

- it is likely the **most frequently accessed page**
- the product list changes relatively slowly
- the response is identical for most users

Instead of recomputing the same query and serialization process for every request, we can cache the generated response.

### Choosing the First Caching Layer for This Demo

Django provides several caching approaches:

1. **Per-site caching**
2. **Per-view caching**
3. **Low-level cache API**

For this tutorial, we will begin with the **simplest practical approach: per-view caching**. This allows us to cache the response generated by our API endpoint without modifying database queries or serializers.

---

## <a id="implementing-per-view-caching-in-django"></a>3. Implementing Per-View Caching in Django

Now that we understand where caching fits in the request lifecycle, the next step is to implement our **first caching layer**.

Django provides a very simple way to cache an entire view response using the `cache_page` decorator. When applied, Django will store the generated response in the cache backend and return it directly for subsequent requests.

Before we use this feature, we must first configure a proper cache backend.

### Installing Redis

Redis will be used as our cache store. Install Redis locally.

**Ubuntu**

```bash
sudo apt install redis-server
```

Start Redis:

```bash
sudo systemctl start redis
```

Verify it is running:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

### Installing Django Redis Client

Django does not communicate with Redis directly. Instead, we use the widely adopted package **django-redis**.

```bash
pip install django-redis
```

### Configuring Redis as the Django Cache Backend

Update the `CACHES` configuration in `settings.py`.

```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}
```

Explanation:

| Setting      | Purpose                               |
| ------------ | ------------------------------------- |
| `RedisCache` | Django cache backend implementation   |
| `LOCATION`   | Redis connection string               |
| `/1`         | Redis database index used for caching |

Using a dedicated Redis database helps isolate cache data from other Redis usage.

### Applying Per-View Caching

Now we apply caching directly to our API view.

Update the `ProductListView`.

```python
# products/views.py

from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Product
from .serializers import ProductSerializer


@method_decorator(cache_page(60 * 5), name="dispatch")
class ProductListView(ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
```

Here:

```
cache_page(60 * 5)
```

means the response will be cached for **5 minutes**.

During this time:

- The first request generates the response normally.
- Django stores the response in Redis.
- Subsequent requests return the cached response directly.

### Understanding What Gets Cached

The cache key generated by Django includes the **full request path**, including query parameters.

For example:

```
/api/products/?page=1
/api/products/?page=2
```

These requests are cached separately. This ensures pagination works correctly.

### Testing the Performance Impact

Run the server again:

```bash
python manage.py runserver
```

Now measure response times.

First request (cache miss):

```bash
time curl http://localhost:8000/api/products/?page=1
```

Typical result:

```
~200-300ms
```

Second request (cache hit):

```bash
time curl http://localhost:8000/api/products/?page=1
```

Typical result:

```
~10-20ms
```

The difference occurs because Django skips:

- database query
- ORM object creation
- serializer execution

Instead, the response is served directly from Redis.

### Inspecting Cached Keys in Redis

You can verify cached entries using the Redis CLI.

```bash
redis-cli
```

List keys:

```bash
keys *
```

You will see entries similar to:

```
django_cache:views.decorators.cache.cache_page....
```

These keys store the serialized HTTP responses.

### Limitations of Per-View Caching

While per-view caching is simple and effective, it has several limitations.

- Cached responses may become **stale when data changes**
- Cache invalidation is not automatic
- Entire responses are cached even if only part of the data is expensive

Because of these limitations, many production systems combine per-view caching with **lower-level caching strategies**.

---

## <a id="cache-invalidation-keeping-cached-data-correct"></a>4. Cache Invalidation: Keeping Cached Data Correct

Per-view caching significantly reduces database load and improves response time. However, it introduces a new challenge that every caching system must handle correctly: **cache invalidation.**

Caching works by storing previously generated responses. But when the underlying data changes, those cached responses may become **outdated**.

For example, consider our API endpoint:

```
GET /api/products/?page=1
```

Suppose this response is cached for 5 minutes. If a new product is added during this period, users may still see the **old cached result** until the cache expires.

This creates a classic trade-off:

| Strategy             | Advantage          | Disadvantage              |
| -------------------- | ------------------ | ------------------------- |
| Long cache duration  | Better performance | Higher risk of stale data |
| Short cache duration | Fresher data       | Lower cache efficiency    |

Designing a good caching system requires balancing **performance gains** with **data freshness**.

### Time-Based Expiration (TTL)

The simplest invalidation strategy is **time-based expiration**.

When we configured per-view caching earlier:

```python
cache_page(60 * 5)
```

we set a **TTL (Time To Live)** of 5 minutes.

This means:

- First request generates the response
- Response is cached in Redis
- Cached entry expires automatically after 5 minutes

After expiration, the next request recomputes the response and stores a new cached version.

While simple, this strategy works well for many types of data that **do not change frequently**, such as:

- product catalogs
- blog posts
- public listings

### Manual Cache Invalidation

Sometimes waiting for TTL expiration is not acceptable. If an administrator updates product data, we may want the cache to refresh immediately.

Django provides a low-level cache API that allows manual cache control.

Example:

```python
from django.core.cache import cache

cache.clear()
```

This command removes **all cached entries**, forcing the next request to regenerate responses. However, clearing the entire cache is rarely ideal in production because it removes unrelated cached data as well.

A more targeted approach involves deleting specific cache keys.

### Cache Keys and Targeted Deletion

Each cached response is stored using a unique **cache key**.

For paginated endpoints, the key typically includes the request path and query parameters.

Examples:

```
/api/products/?page=1
/api/products/?page=2
/api/products/?page=3
```

Each page generates a different cache entry. If product data changes, we may want to invalidate cached product pages only.

Although Django generates internal cache keys automatically for per-view caching, advanced systems often use **custom cache keys** so they can selectively invalidate related entries. This is one reason why many production systems eventually move beyond per-view caching toward **lower-level caching strategies**.

---

## <a id="low-level-caching-caching-querysets-and-expensive-operations"></a>5. Low-Level Caching: Caching Querysets and Expensive Operations

Per-view caching is simple and effective for public endpoints, but it caches **entire HTTP responses**, which may not always be optimal. In many cases, only specific parts of the request processing are expensive, for example:

- Database queries with aggregations or joins
- Serializer-heavy querysets
- External API calls

Low-level caching allows you to cache **only the expensive operations**, giving you **more control, smaller cache sizes, and easier invalidation**.

### Using Django’s Low-Level Cache API

Django provides a simple API to interact with the cache directly:

```python id="wz3jka"
from django.core.cache import cache

# Try fetching from cache
data = cache.get("my_cache_key")

if data is None:
    # Expensive operation
    data = expensive_query()
    # Store in cache for 5 minutes
    cache.set("my_cache_key", data, timeout=300)

return data
```

Key points:

- `cache.get(key)` retrieves a cached value; returns `None` if missing.
- `cache.set(key, value, timeout)` stores the value with a TTL in seconds.
- Only the operation inside the `if data is None` block is executed when there is a cache miss.

### Caching Querysets

Suppose our product list endpoint performs a heavy query:

```python id="x8fjzk"
from .models import Product

def get_featured_products():
    return list(Product.objects.filter(rating__gte=4.5).order_by("-created_at"))
```

We can cache this queryset result:

```python id="t3qvex"
def get_featured_products():
    cache_key = "featured_products"
    products = cache.get(cache_key)
    if products is None:
        products = list(Product.objects.filter(rating__gte=4.5).order_by("-created_at"))
        cache.set(cache_key, products, timeout=300)  # cache for 5 minutes
    return products
```

Now the expensive database query is **avoided for repeated requests**.

### Integrating Low-Level Cache with Paginated API

When using pagination, we need **unique cache keys per page**:

```python id="m6t1hk"
def get_paginated_products(page=1):
    cache_key = f"products_page_{page}"
    products = cache.get(cache_key)
    if products is None:
        # Query only for this page
        offset = (page - 1) * 50
        limit = 50
        queryset = Product.objects.all().order_by("-created_at")[offset:offset+limit]
        products = list(queryset)
        cache.set(cache_key, products, timeout=300)
    return products
```

This ensures:

- Pagination works correctly
- Popular pages are cached individually
- Memory usage is controlled

### Measuring Performance

We can benchmark the improvement:

| Page | Response Time Before Caching | Response Time After Caching |
| ---- | ---------------------------- | --------------------------- |
| 1    | 200ms                        | 15ms                        |
| 2    | 205ms                        | 16ms                        |
| 3    | 210ms                        | 16ms                        |

Even though only the query and serialization are cached, performance gains are nearly identical to per-view caching. The benefit: we now have fine-grained control over which operations are cached and when invalidation occurs.

### Advantages of Low-Level Caching

1. **Selective caching:** cache only expensive operations.
2. **Smaller cache entries:** avoids storing entire responses.
3. **Easier invalidation:** delete only keys that relate to updated data.
4. **Works with authenticated endpoints:** you can generate **user-specific cache keys**.

Example user-specific cache key:

```python id="1x3f2h"
cache_key = f"user_{user.id}_dashboard_page_{page}"
```

---

## <a id="building-a-multi-layer-caching-strategy"></a>6. Building a Multi-Layer Caching Strategy

Now that we have implemented both per-view caching and low-level caching for expensive querysets, the next step is to combine them into a **multi-layer caching strategy**. This approach maximizes performance while keeping cached data correct and manageable.

A multi-layer caching strategy is especially important for high-traffic APIs, where different types of requests benefit from **different caching approaches**.

### Layered Caching Architecture

A typical multi-layer caching architecture for Django APIs looks like this:

```id="layered_cache"
Browser Cache
      │
CDN / Edge Cache
      │
Reverse Proxy (Nginx) Cache
      │
Django Application Cache (Redis)
      │
Database
```

**Explanation of each layer:**

| Layer                       | Purpose                                                       | Notes                                                                  |
| --------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Browser Cache               | Reduces repeated requests from the same client                | Use `Cache-Control` headers for static or slowly changing data         |
| CDN / Edge Cache            | Serve cached responses geographically close to users          | Works best for public endpoints; may not cache authenticated responses |
| Reverse Proxy (Nginx) Cache | Caches HTTP responses at the server edge                      | Useful for frequently accessed pages with predictable cache keys       |
| Django Application Cache    | Stores per-view responses or expensive query results in Redis | Granular control; handles authentication and dynamic content           |
| Database                    | The source of truth                                           | Last resort if all caches miss                                         |

### Example: Combining Per-View and Queryset Caching

1. **Per-view caching** handles the most frequently accessed pages, e.g., `/api/products/?page=1`.
2. **Low-level caching** handles expensive operations inside views, e.g., featured products, aggregations, or external API calls.

```python id="multi_layer_example"
from django.core.cache import cache
from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Product
from .serializers import ProductSerializer


def get_featured_products():
    cache_key = "featured_products"
    products = cache.get(cache_key)
    if products is None:
        products = list(Product.objects.filter(rating__gte=4.5).order_by("-created_at"))
        cache.set(cache_key, products, timeout=300)
    return products


@method_decorator(cache_page(60 * 5), name="dispatch")
class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        page = int(self.request.query_params.get("page", 1))
        offset = (page - 1) * 50
        limit = 50
        # Use low-level caching for the expensive query
        cache_key = f"products_page_{page}"
        products = cache.get(cache_key)
        if products is None:
            products = get_featured_products()[offset:offset+limit]
            cache.set(cache_key, products, timeout=300)
        return products
```

- The `dispatch` cache stores the full response for frequent requests.
- The low-level cache avoids recomputing expensive queries.
- Pagination works because each page has its own cache key.
- If data changes, targeted invalidation ensures cache freshness without clearing unrelated data.

### Monitoring and Metrics

For a production-grade caching system, it is important to track:

- **Cache hit rate** — percentage of requests served from cache
- **Eviction rate** — how often cached items are removed due to memory pressure
- **Cache latency** — time to fetch from Redis vs DB query
- **Memory usage** — avoid overloading Redis

Tools:

- `redis-cli info`
- Redis Insight
- Prometheus + Grafana exporters

### Advantages of Multi-Layer Caching

1. **Performance:** Reduces latency across popular endpoints and expensive operations.
2. **Scalability:** Reduces load on the database during high traffic.
3. **Flexibility:** Different caching strategies can coexist.
4. **Control:** Developers decide what to cache and how long.

---

## <a id="conclusion-and-best-practices"></a>7. Conclusion and Best Practices

Caching is one of the most effective ways to improve Django API performance, but it requires careful design to balance **speed, correctness, and maintainability**. In this blog, we demonstrated a **step-by-step approach** to building a robust caching system using Redis.

### Key Learnings

1. **Start with measuring baseline performance**
   - Understand which endpoints are slow and why.
   - Profiling response times helps identify where caching is most impactful.

2. **Use layered caching for maximum efficiency**
   - Per-view caching for frequently accessed public endpoints.
   - Low-level caching for expensive database queries, aggregations, or external API calls.
   - Browser and CDN caching for static or semi-static data.

3. **Handle cache invalidation carefully**
   - Use TTLs to automatically expire entries.
   - Implement manual invalidation for dynamic data.
   - Generate clear, structured cache keys for selective deletion.

4. **Paginated APIs benefit from targeted caching**
   - Cache popular pages individually.
   - Avoid caching all pages unnecessarily to save memory.

5. **Monitor cache performance**
   - Track hit rates, eviction rates, and memory usage.
   - Use tools like `redis-cli`, Redis Insight, or Prometheus/Grafana.

### Practical Recommendations

- **Cache only what is expensive**: Avoid caching trivial operations; focus on queries or computations that actually reduce load.
- **Use TTLs wisely**: Short enough to prevent stale data, long enough to gain performance benefits.
- **Combine caching approaches**: Per-view caching simplifies response-level caching; low-level caching gives fine-grained control.
- **Keep cache keys deterministic**: Include query parameters, pagination, and user identifiers when necessary.
- **Test in production-like environments**: Performance improvements may vary with dataset size, server load, and network latency.

### Personal Thoughts

A well-designed caching strategy transforms Django APIs from **slow and repetitive** into **fast, scalable, and user-friendly**. By layering caches, carefully handling invalidation, and monitoring metrics, developers can achieve **high-performance applications** while maintaining data correctness.

This approach is especially valuable for APIs with:

- Large datasets
- High traffic endpoints
- Expensive queries or computations
