## RabbitMQ 

* Channel
* Exchange
* Route
* Queue


### Anti Pattern

```

+----------+      +---------+       +-------+       +---------+        +----------+
| Producer |  ==> | Channel |  ==>  | Queue |  ==>  | Channel |  ==>   | Consumer |
+----------+      +---------+       +-------+       +---------+        +----------+

```

### Correct Pattern

```

+----------+      +---------+       +----------+   routes    +-------+       +---------+       +----------+
| Producer |  ==> | Channel |  ==>  | Exchange |  ========>  | Queue |  ==>  | Channel |  ==>  | Consumer |
+----------+      +---------+       +----------+             +-------+       +---------+       +----------+

```
