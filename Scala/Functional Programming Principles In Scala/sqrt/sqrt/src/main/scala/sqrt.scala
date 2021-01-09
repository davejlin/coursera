class sqrt {
    def sqrtIter(guess: Double, x: Double): Double =
        if (isGoodEnough(guess, x)) guess
        else sqrtIter(improve(guess, x), x)

    def isGoodEnough(guess: Double, x: Double): Boolean =
        (guess * guess - x).abs / x < 0.0001

    def improve(guess: Double, x: Double): Double =
        (guess + x / guess) / 2

    def sqrt(x: Double) = sqrtIter(1.0, x)
}
