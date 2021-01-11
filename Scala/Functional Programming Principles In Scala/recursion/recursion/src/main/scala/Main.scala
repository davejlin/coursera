object Main extends App {
  def recursion = new recursion()
  def x = 1e30
  println("The sqrt of " + x + " is " + recursion.sqrt(x))
  println("The gcd of 14 and 21 is " + recursion.gcd(14, 21))
  println("16! is " + recursion.factorial(16))
  println("16! is " + recursion.factorialTail(16))
}