package recfun

import org.junit._
import org.junit.Assert.assertEquals

class RecFunSuite {
  import RecFun._

  // ------ balance tests -----------------------------------------------------

  @Test def `balance: '(if (zero? x) max (/ 1 x))' is balanced`: Unit =
    assert(balance("(if (zero? x) max (/ 1 x))".toList))

  @Test def `balance: 'I told him ...' is balanced`: Unit =
    assert(balance("I told him (that it's not (yet) done).\n(But he wasn't listening)".toList))

  @Test def `balance: ':-)' is unbalanced`: Unit =
    assert(!balance(":-)".toList))

  @Test def `balance: counting is not enough`: Unit =
    assert(!balance("())(".toList))

  @Test def `balance: case 5`: Unit =
    assert(!balance(")()()()()()()()()()()()()()()()()()()()()()()()()()".toList))

  @Test def `balance: case 6`: Unit =
    assert(!balance("()()()()()()()()()()()()()()()()()()()()()()()()())".toList))

  @Test def `balance: case 7`: Unit =
    assert(!balance("()()()()()()()()()()()()())()()()()()()()()()()()()".toList))

  @Test def `balance: case 8`: Unit =
    assert(balance("".toList))

  @Test def `balance: case 9`: Unit =
    assert(!balance("(".toList))

  @Test def `balance: case 10`: Unit =
    assert(!balance(")".toList))

  @Test def `balance: case 11`: Unit =
    assert(balance("()".toList))

  // ------ countChange tests -------------------------------------------------

  @Test def `countChange: example given in instructions`: Unit =
    assertEquals(3, countChange(4,List(1,2)))

  @Test def `countChange: sorted CHF`: Unit =
    assertEquals(1022, countChange(300,List(5,10,20,50,100,200,500)))

  @Test def `countChange: no pennies`: Unit =
    assertEquals(0, countChange(301,List(5,10,20,50,100,200,500)))

  @Test def `countChange: unsorted CHF`: Unit =
    assertEquals(1022, countChange(300,List(500,5,50,100,20,200,10)))

  @Test def `countChange: test5`: Unit =
    assertEquals(5, countChange(100,List(25,5)))

  @Test def `countChange: test6`: Unit =
    assertEquals(6, countChange(15,List(10,5,1)))

  @Test def `countChange: test7`: Unit =
    assertEquals(18, countChange(30,List(5,25,10,1)))

  @Test def `countChange: zero`: Unit =
    assertEquals(0, countChange(0,List(5,25,10,1)))

  @Test def `countChange: negative`: Unit =
    assertEquals(0, countChange(-100,List(5,25,10,1)))

  @Test def `countChange: no coins`: Unit =
    assertEquals(0, countChange(100,List[Int]()))

  @Test def `countChange: sorted CHF with 1`: Unit =
    assertEquals(15280, countChange(300,List(1, 5,10,20,50,100,200,500)))

  // ------ pascal tests ------------------------------------------------------

  @Test def `pascal: col=0,row=2`: Unit =
    assertEquals(1, pascal(0, 2))

  @Test def `pascal: col=1,row=2`: Unit =
    assertEquals(2, pascal(1, 2))

  @Test def `pascal: col=1,row=3`: Unit =
    assertEquals(3, pascal(1, 3))

  @Test def `pascal: col=32,row=33`: Unit =
    assertEquals(1166803110, pascal(16, 33))

  @Rule def individualTestTimeout = new org.junit.rules.Timeout(10 * 1000)
}