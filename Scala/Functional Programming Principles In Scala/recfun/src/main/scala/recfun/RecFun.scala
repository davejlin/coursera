package recfun
import scala.math.{max, min}

object RecFun extends RecFunInterface {
  def main(args: Array[String]): Unit = {
    println("Pascal's Triangle")
    for (row <- 0 to 30) {
      for (col <- 0 to row) {
        val vPascal = pascal(col, row)
        print(s"${vPascal} ")

        val vTail = pascalTail(col, row)
        val vIter = pascalIter(col, row)
        if (vPascal != vTail || vPascal != vIter) {
          print(s"ERROR: pascal: ${vPascal} pascalTail: ${vTail} pascalIter: ${vIter}")
        }
      }
      println()
    }
  }

  /**
   * Exercise 1
   */
  def pascal(c: Int, r: Int): Int = {
    if (c == 0 || c == r) 1
    else pascal(c-1, r-1) + pascal(c, r-1)
  }

  def pascalTail(c: Int, r: Int): Int = {
    var cOpt = c
    def loop(col: Int, row: Int, previous: Array[Int], current: Array[Int]): Int = {
      current(col) = (if (col > 0) previous(col - 1) else 0) + (if (col < row) previous(col) else 0)

      if ((col == cOpt) && (row == r)) current(col)
      else if (col < row) loop(col + 1, row, previous, current)
      else loop(0, row + 1, current, new Array(_length = row + 2))
    }

    if (c == 0 || c == r) 1
    else {
      if (c > r/2) cOpt = r - c
      loop(0, 1, Array(1), new Array(_length = 2))
    }
  }

  def pascalIter(c: Int, r: Int): Int = {
    if (c == 0 || c == r) return 1
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

  /**
   * Exercise 2
   */
  def balance(chars: List[Char]): Boolean = {
    true
  }

  /**
   * Exercise 3
   */
  def countChange(money: Int, coins: List[Int]): Int = {
    1
  }
}
