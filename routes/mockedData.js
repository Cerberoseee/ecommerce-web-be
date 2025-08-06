export const mockedCustomerActivityData = [
  {
    "id": "b1a0b8b0-b7cb-4e2e-b60e-65c2481e01ea",
    "customer_id": "user-001",
    "activity_type": "login",
    "timestamp": "2025-08-04T08:00:00Z",
    "metadata": {
      "device": "Chrome on Windows",
      "ip_address": "192.168.1.101"
    }
  },
  {
    "id": "a90b8b7c-ff7e-4f71-908c-7efcba1428ea",
    "customer_id": "user-001",
    "activity_type": "search",
    "timestamp": "2025-08-04T08:00:15Z",
    "metadata": {
      "search_query": "gaming laptop",
      "results_count": 12
    }
  },
  {
    "id": "b77d2e2e-8f83-4a18-b45c-60fabc7bda2e",
    "customer_id": "user-001",
    "activity_type": "view_product",
    "timestamp": "2025-08-04T08:01:00Z",
    "metadata": {
      "product_id": "prod-acer-nitro5",
      "page_url": "/product/acer-nitro-5",
      "referrer": "/search?q=gaming+laptop"
    }
  },
  {
    "id": "84c20b02-0135-4b4f-a68f-145e2977c5cb",
    "customer_id": "user-001",
    "activity_type": "add_to_cart",
    "timestamp": "2025-08-04T08:02:10Z",
    "metadata": {
      "product_id": "prod-acer-nitro5",
      "quantity": 1
    }
  },
  {
    "id": "49f1833f-56f9-4a6c-b10e-31d412ff89d9",
    "customer_id": "user-001",
    "activity_type": "purchase",
    "timestamp": "2025-08-04T08:03:40Z",
    "metadata": {
      "order_id": "order-001",
      "product_ids": ["prod-acer-nitro5"],
      "total_amount": 1099.00,
      "currency": "USD"
    }
  },
  {
    "id": "db3a8403-d70b-4720-b3e1-e56d4b1cc34d",
    "customer_id": "user-001",
    "activity_type": "logout",
    "timestamp": "2025-08-04T08:05:00Z",
    "metadata": {
      "session_duration_seconds": 300,
      "last_page": "/order/success"
    }
  },

  {
    "id": "c552f94a-2398-4439-b0f3-e251a2ff82f2",
    "customer_id": "user-002",
    "activity_type": "login",
    "timestamp": "2025-08-04T09:10:00Z",
    "metadata": {
      "device": "Safari on iPhone",
      "ip_address": "10.0.0.54"
    }
  },
  {
    "id": "53c4a8fa-e6e4-4632-9c8d-b8c47f8c3b41",
    "customer_id": "user-002",
    "activity_type": "search",
    "timestamp": "2025-08-04T09:10:20Z",
    "metadata": {
      "search_query": "wireless earbuds",
      "results_count": 6
    }
  },
  {
    "id": "63b13d75-0b65-4f57-97eb-c4b5dc12e9c2",
    "customer_id": "user-002",
    "activity_type": "view_product",
    "timestamp": "2025-08-04T09:11:00Z",
    "metadata": {
      "product_id": "prod-sony-earbuds",
      "page_url": "/product/sony-wf-1000xm5",
      "referrer": "/search?q=wireless+earbuds"
    }
  },
  {
    "id": "2a412874-95d3-4050-ade5-43c37c92c1d2",
    "customer_id": "user-002",
    "activity_type": "add_to_cart",
    "timestamp": "2025-08-04T09:11:45Z",
    "metadata": {
      "product_id": "prod-sony-earbuds",
      "quantity": 2
    }
  },
  {
    "id": "6fbbf9b1-2133-4394-9f24-bd8b6ea34cb3",
    "customer_id": "user-002",
    "activity_type": "purchase",
    "timestamp": "2025-08-04T09:12:20Z",
    "metadata": {
      "order_id": "order-002",
      "product_ids": ["prod-sony-earbuds"],
      "total_amount": 458.00,
      "currency": "USD"
    }
  },

  {
    "id": "ccc7aa36-fd0e-4e8c-ae83-8c1ff11f8d29",
    "customer_id": "user-003",
    "activity_type": "login",
    "timestamp": "2025-08-04T10:30:00Z",
    "metadata": {
      "device": "Firefox on Ubuntu",
      "ip_address": "172.16.0.20"
    }
  },
  {
    "id": "7d97fa58-6607-4078-8738-3e91f15569fa",
    "customer_id": "user-003",
    "activity_type": "search",
    "timestamp": "2025-08-04T10:30:10Z",
    "metadata": {
      "search_query": "mechanical keyboard",
      "results_count": 8
    }
  },
  {
    "id": "5fc2227f-7a71-48cf-a109-949fb3e9c04a",
    "customer_id": "user-003",
    "activity_type": "view_product",
    "timestamp": "2025-08-04T10:30:45Z",
    "metadata": {
      "product_id": "prod-keychron-k8",
      "page_url": "/product/keychron-k8",
      "referrer": "/search?q=mechanical+keyboard"
    }
  },
  {
    "id": "4d18f3ab-fb17-478e-8692-9e28e3605395",
    "customer_id": "user-003",
    "activity_type": "add_to_cart",
    "timestamp": "2025-08-04T10:31:30Z",
    "metadata": {
      "product_id": "prod-keychron-k8",
      "quantity": 1
    }
  },
  {
    "id": "85d59e29-30e1-4b60-b3e1-82b1bc8489f6",
    "customer_id": "user-003",
    "activity_type": "purchase",
    "timestamp": "2025-08-04T10:32:10Z",
    "metadata": {
      "order_id": "order-003",
      "product_ids": ["prod-keychron-k8"],
      "total_amount": 89.00,
      "currency": "USD"
    }
  }
];

export const mockedCustomerOrderHistoryData = [
  {
    "customer_id": "user-001",
    "employee_id": "emp-001",
    "amountReceived": 150.00,
    "changeGiven": 10.00,
    "orderDate": "2025-08-04T08:30:00Z",
    "total": 140.00,
    "status": "PAID",
    "invoiceUrl": "https://store.com/invoices/INV-001.pdf",
    "orderItem": {
      "orderItemId": "item-001",
      "orderId": "order-001",
      "products": [
        {
          "productId": "prod-001",
          "name": "Green Tea Bottle",
          "quantity": 2,
          "price": 3.50
        },
        {
          "productId": "prod-002",
          "name": "Egg Sandwich",
          "quantity": 1,
          "price": 4.00
        },
        {
          "productId": "prod-003",
          "name": "Cold Brew",
          "quantity": 1,
          "price": 5.00
        }
      ],
      "productItems": null,
      "createdAt": "04/08/2025 08:30:00",
      "updatedAt": "04/08/2025 08:35:00"
    }
  },
  {
    "customer_id": "user-001",
    "employee_id": "emp-002",
    "amountReceived": 100.00,
    "changeGiven": 20.00,
    "orderDate": "2025-07-31T14:10:00Z",
    "total": 80.00,
    "status": "PAID",
    "invoiceUrl": "https://store.com/invoices/INV-005.pdf",
    "orderItem": {
      "orderItemId": "item-002",
      "orderId": "order-002",
      "products": [
        {
          "productId": "prod-004",
          "name": "Salad Bowl",
          "quantity": 1,
          "price": 7.50
        },
        {
          "productId": "prod-005",
          "name": "Iced Latte",
          "quantity": 2,
          "price": 5.50
        }
      ],
      "productItems": null,
      "createdAt": "31/07/2025 14:10:00",
      "updatedAt": "31/07/2025 14:13:00"
    }
  },
  {
    "customer_id": "user-002",
    "employee_id": "emp-001",
    "amountReceived": 50.00,
    "changeGiven": 0.00,
    "orderDate": "2025-08-03T12:00:00Z",
    "total": 50.00,
    "status": "PAID",
    "invoiceUrl": "https://store.com/invoices/INV-008.pdf",
    "orderItem": {
      "orderItemId": "item-003",
      "orderId": "order-003",
      "products": [
        {
          "productId": "prod-006",
          "name": "Hot Cappuccino",
          "quantity": 1,
          "price": 4.00
        },
        {
          "productId": "prod-007",
          "name": "Cheesecake Slice",
          "quantity": 2,
          "price": 5.00
        },
        {
          "productId": "prod-008",
          "name": "Orange Juice",
          "quantity": 1,
          "price": 3.00
        }
      ],
      "productItems": null,
      "createdAt": "03/08/2025 12:00:00",
      "updatedAt": "03/08/2025 12:02:00"
    }
  },
  {
    "customer_id": "user-003",
    "employee_id": "emp-003",
    "amountReceived": 200.00,
    "changeGiven": 80.00,
    "orderDate": "2025-08-01T10:45:00Z",
    "total": 120.00,
    "status": "PAID",
    "invoiceUrl": "https://store.com/invoices/INV-011.pdf",
    "orderItem": {
      "orderItemId": "item-004",
      "orderId": "order-004",
      "products": [
        {
          "productId": "prod-009",
          "name": "Ham & Cheese Toast",
          "quantity": 2,
          "price": 6.50
        },
        {
          "productId": "prod-010",
          "name": "Matcha Latte",
          "quantity": 1,
          "price": 5.50
        },
        {
          "productId": "prod-011",
          "name": "Chocolate Cookie",
          "quantity": 3,
          "price": 2.00
        }
      ],
      "productItems": null,
      "createdAt": "01/08/2025 10:45:00",
      "updatedAt": "01/08/2025 10:47:00"
    }
  }
];