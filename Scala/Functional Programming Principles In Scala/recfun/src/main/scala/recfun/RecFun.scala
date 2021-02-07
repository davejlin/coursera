package recfun
import scala.math.{max, min}

object RecFun extends RecFunInterface {
  def main(args: Array[String]): Unit = {
    testPascalTriangle(16, 33)
    createPascalTriangle(30)
    checkBalance()
    checkCountChange()
  }

  def testPascalTriangle(c: Int, r: Int): Unit = {
    val ans = pascal(c, r)
    println(s"\nPascal Triangle value for c: $c r: $r = $ans")
  }

  def createPascalTriangle(n: Int): Unit = {
    println("\nPascal's Triangle\n")
    for (row <- 0 to n) {
      for (col <- 0 to row) {
        val vPascal = pascal(col, row)
        print(s"${vPascal} ")

        val vTail = pascalTail(col, row)
        val vIter = pascalIter(col, row)
        if (vPascal != vTail || vPascal != vIter) {
          print(s"ERROR: pascal: $vPascal pascalTail: $vTail pascalIter: $vIter")
        }
      }
      println()
    }
  }

  def checkBalance(): Unit = {
    println("\nCheck Balance:\n")
    val test1 = balance("(if (zero? x) max (/ 1 x))".toList)
    val test2 = balance("I told him (that it's not (yet) done).\n(But he wasn't listening)".toList)
    val test3 = balance(":-)".toList)
    val test4 = balance("())(".toList)
    val test5 = balance(")()()()()()()()()()()()()()()()()()()()()()()()()()".toList)
    val test6 = balance("()()()()()()()()()()()()()()()()()()()()()()()()())".toList)
    val test7 = balance("()()()()()()()()()()()()())()()()()()()()()()()()()".toList)
    val test8 = balance("".toList)
    val test9 = balance("(".toList)
    val test10 = balance(")".toList)
    val test11 = balanceIter("()".toList)
    val test12 = balanceIter("(ok)".toList)

    val test1i = balanceIter("(if (zero? x) max (/ 1 x))".toList)
    val test2i = balanceIter("I told him (that it's not (yet) done).\n(But he wasn't listening)".toList)
    val test3i = balanceIter(":-)".toList)
    val test4i = balanceIter("())(".toList)
    val test5i = balanceIter(")()()()()()()()()()()()()()()()()()()()()()()()()()".toList)
    val test6i = balanceIter("()()()()()()()()()()()()()()()()()()()()()()()()())".toList)
    val test7i = balanceIter("()()()()()()()()()()()()())()()()()()()()()()()()()".toList)
    val test8i = balanceIter("".toList)
    val test9i = balanceIter("(".toList)
    val test10i = balanceIter(")".toList)
    val test11i = balanceIter("()".toList)
    val test12i = balanceIter("(ok)".toList)

    println(s"1: $test1 $test1i\n2: $test2 $test2i\n3: $test3 $test3i\n4: $test4 $test4i\n5: $test5 $test5i\n6: $test6 $test6i\n7: $test7 $test7i\n8: $test8 $test8i\n9: $test9 $test9i\n10: $test10 $test10i\n11: $test11 $test11i\n12: $test12 $test12i")
  }

  def checkCountChange(): Unit = {
    val test1 = countChange(300,List(500,5,50,100,20,200,10))
    val test2 = countChange(300,List(5,10,20,50,100,200,500))
    val test3 = countChange(4,List(1,2))
    val test4 = countChange(301,List(5,10,20,50,100,200,500))
    val test5 = countChange(100,List(5, 25))
    val test6 = countChange(15, List(10, 5, 1))
    val test7 = countChange(30, List(5,25,10,1))
    println("\nCheck Count Change:\n")
    println(s"test1: $test1 (1022),\ntest2: $test2 (1022),\ntest3: $test3 (3),\ntest4: $test4 (0),\ntest5: $test5 (5),\ntest6: $test6 (6),\ntest7: $test7 (18)")
  }

  /**
   * Exercise 1
   * 
   * pascal: find the value of the c column and r row in Pascal's triangle
   */
  def pascal(c: Int, r: Int): Int = {
    if (c == 0 || c == r) 1
    else pascal(c-1, r-1) + pascal(c, r-1)
  }

  /**
    * Exercise 1
    * pascalTail: find the value of the c column and r row in Pascal's triangle
    * Tail recursive version
    *
    * @param c column
    * @param r row
    * @return
    */
  def pascalTail(c: Int, r: Int): Int = {
    val cOpt = if (c > r/2) r - c else c
    def loop(col: Int, row: Int, previous: Array[Int], current: Array[Int]): Int = {
      current(col) = (if (col > 0) previous(col - 1) else 0) + (if (col < row) previous(col) else 0)

      if ((col == cOpt) && (row == r)) current(col)
      else if (col < row) loop(col + 1, row, previous, current)
      else loop(0, row + 1, current, new Array(_length = row + 2))
    }

    if (c == 0 || c == r) 1
    else loop(0, 1, Array(1), new Array(_length = 2))
  }

  def pascalIter(c: Int, r: Int): Int = {
    if (c == 0 || c == r) 1
    else {
      val nCol = c + 1
      val arr = Array.ofDim[Int](nCol, r + 1)
      val diff = r-c

      for (row <- 0 to r) {
        val cStart = if (row <= diff) 0 else (row - diff)
        for (col <- cStart to c)
          arr(col)(row) = (if (col == 0 || row == 0 || col == row) 1 else arr(col-1)(row-1) + arr(col)(row-1))
      }

      arr(c-1)(r-1) + arr(c)(r-1)
    }
  }

  /**
    * Exercise 2
    * Parentheses Balancing
    * Recursive version
    *
    * @param chars list of characters
    * @return
    */
  def balance(chars: List[Char]): Boolean = {
    def loop(chars: List[Char], nOpen: Int, nClosed: Int): Boolean = {
      if (nClosed > nOpen) false
      else if (chars.isEmpty) nOpen == nClosed
      else {
        val char = chars.head
        if (char == '(') loop(chars.tail, nOpen + 1, nClosed)
        else if (char == ')') loop(chars.tail, nOpen, nClosed + 1)
        else loop(chars.tail, nOpen, nClosed)
      }
    }

    loop(chars, 0, 0)
  }

  /**
    * Exercise 2
   *  Parentheses Balancing
   *  Iterative version
   * 
    * @param chars
    * @return
    */
  def balanceIter(chars: List[Char]): Boolean = {
    val nOpen = Array(0)
    val nClosed = Array(0)
    val unbalanced = Array(0)
    val list = chars

    for (i <- 0 to chars.length-1; if (unbalanced(0) == 0)) {
      val char = chars(i)
      if (char == '(') nOpen(0) += 1
      else if (char == ')') {
        nClosed(0) += 1
        if (nClosed(0) > nOpen(0)) unbalanced(0) = 1
      }
    }
    unbalanced(0) == 0 && nOpen(0) == nClosed(0)
  }


  /**
    * Exercise 3
    * 
    * Counting Change
    * 
    * Coeffs (coefficients):  Each coefficient is the number of each coin value in ascending order.
    * For example, if the coins are [1, 5, 10, 25], then the coefficients are [a, b, c, d], and the
    * sum of the coins is: sum = a*1 + b*5 + c*10 + d*25
    * 
    * @param money total amount to make change
    * @param coins list of available coins to make change (can be unsorted)
    * @return
    */
  def countChange(money: Int, coins: List[Int]): Int = {
    val coinsSorted = coins.sortWith(_ < _)
    val length = coinsSorted.length

    /**
      * sum
      *
      * @param coeffs coefficients
      * @param i current index
      * @param total amount summed so far
      * @return
      */
    def sum(coeffs: List[Int], i: Int, total: Int): Int = {
      if (i >= length) total
      else sum(coeffs, i+1, total + (coeffs(i) * coinsSorted(i)))
    }

    /**
      * getNextCoeff
      *
      * Get the next coefficients by incrementing the lowest index possible without exceeding the money amount.
      * If money is exceeded, reset the values corresponding to this index to zero and recurse with an incremented index.
      * Stop recursing when the highest index exceeds the list length and return an empty coefficients list.
      * 
      * @param coeffs coefficients
      * @param i current index
      * @return
      */
    def getNextCoeff(coeffs: List[Int], i: Int): List[Int] = {
      if (i >= length) List[Int]()
      else {
        def testCoeffs = coeffs.updated(i, coeffs(i) + 1)
        if (sum(testCoeffs, 0, 0) > money) {
          def nextCoeffs = coeffs.updated(i, 0)
          getNextCoeff(nextCoeffs, i+1)
        } else {
          testCoeffs
        }
      }
    }

    /**
      * loop
      *
      * @param coeffs coeffcients
      * @param n number of times change can be made for the amount of money
      * @return
      */
    def loop(coeffs: List[Int], n: Int): Int = {
      if (coeffs.isEmpty) n
      else {
        def nextN = if (sum(coeffs, 0, 0) == money) n+1 else n
        def nextCoeffs = getNextCoeff(coeffs, 0)
        loop(nextCoeffs, nextN)
      }
    }

    if (money <= 0) 0
    else loop(List.fill(length)(0), 0)
  }
}
