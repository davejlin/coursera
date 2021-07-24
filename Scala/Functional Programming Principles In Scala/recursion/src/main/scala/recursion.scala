class recursion {
    def sqrt(x: Double) = {
        def sqrtIter(guess: Double, x: Double): Double =
            if (isGoodEnough(guess, x)) guess
            else sqrtIter(improve(guess, x), x)

        def isGoodEnough(guess: Double, x: Double): Boolean =
            (guess * guess - x).abs / x < 0.0001

        def improve(guess: Double, x: Double): Double =
            (guess + x / guess) / 2

        sqrtIter(1.0, x)
    }

    def gcd(a: Int, b: Int): Int = 
        if (b == 0) a else gcd(b, a % b)

    def factorial(n: Int): Int =
        if (n == 0) 1 else n * factorial(n-1)

    def factorialTail(n: Int): Int = {
        def loop(acc: Int, n: Int): Int = 
            if (n == 0) acc
            else loop(n * acc, n - 1)

        loop(1, n);
    }
}
