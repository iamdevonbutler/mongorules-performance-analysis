On macbook pro (Retina, 13-inch, Mid 2014):
- 2.6 GHz Intel Core i5
- OS El Capitan
- 8 GB 1600 MHz DDR3

1 million insert operations w/ validation in series:

Mongo native            - 3080 ops/sec (1000000 itterations)
Mongorules (novalidate) - 2899 ops/sec (1000000 itterations)
Mongorules              - 2410 ops/sec (1000000 itterations)
Mongoose                - 1752 ops/sec (1000000 itterations)
