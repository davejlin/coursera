package funsets

import org.junit._

/**
 * This class is a test suite for the methods in object FunSets.
 *
 * To run this test suite, start "sbt" then run the "test" command.
 */
class FunSetSuite {

  import FunSets._

  @Test def `contains is implemented`: Unit = {
    assert(contains(x => true, 100))
    assert(contains(x => x > 0, 100))
    assert(contains(x => x < 0, -100))
    assert(!contains(x => x < 0, 100))
    assert(contains(x => x == 0, 0))
  }

  /**
   * When writing tests, one would often like to re-use certain values for multiple
   * tests. For instance, we would like to create an Int-set and have multiple test
   * about it.
   *
   * Instead of copy-pasting the code for creating the set into every test, we can
   * store it in the test class using a val:
   *
   *   val s1 = singletonSet(1)
   *
   * However, what happens if the method "singletonSet" has a bug and crashes? Then
   * the test methods are not even executed, because creating an instance of the
   * test class fails!
   *
   * Therefore, we put the shared values into a separate trait (traits are like
   * abstract classes), and create an instance inside each test method.
   *
   */

  trait TestSets {
    val s1 = singletonSet(1)
    val s2 = singletonSet(2)
    val s3 = singletonSet(3)
  }

  /**
   * This test is currently disabled (by using @Ignore) because the method
   * "singletonSet" is not yet implemented and the test would fail.
   *
   * Once you finish your implementation of "singletonSet", remvoe the
   * @Ignore annotation.
   */
  @Test def `singleton set one contains one`: Unit = {

    /**
     * We create a new instance of the "TestSets" trait, this gives us access
     * to the values "s1" to "s3".
     */
    new TestSets {
      /**
       * The string argument of "assert" is a message that is printed in case
       * the test fails. This helps identifying which assertion failed.
       */
      assert(contains(s1, 1), "Singleton")
      assert(contains(s2, 2), "Singleton")
      assert(contains(s3, 3), "Singleton")
      assert(!contains(s2, 3), "Singleton")
    }
  }

  @Test def `union contains all elements of each set`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      assert(contains(s, 1), "Union 1")
      assert(contains(s, 2), "Union 2")
      assert(!contains(s, 3), "Union 3")
    }
  }

  @Test def `intersect contains common elements of each set`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s1, s3)
      val i = intersect(s, t)
      assert(contains(i, 1), "Intersect 1")
      assert(!contains(i, 2), "Intersect 2")
      assert(!contains(s, 3), "Intersect 3")
    }
  }

  @Test def `diff contains the difference of two sets`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s1, s3)
      val d = diff(s, t)
      assert(!contains(d, 1), "Diff 1")
      assert(contains(d, 2), "Diff 2")
      assert(!contains(d, 3), "Diff 3")
    }
  }

  @Test def `filter returns the subset for which p holds`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s, s3)
      val f = filter(t, x => x < 3)
      assert(contains(f, 1), "Filter 1")
      assert(contains(f, 2), "Filter 2")
      assert(!contains(f, 3), "Filter 3")
      assert(!contains(f, 0), "Filter 4")
    }
  }

  @Test def `forall`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s, s3)
      assert(FunSets.forall(t, x => x > 0), "Filter 1")
      assert(FunSets.forall(t, x => x < 4), "Filter 2")
      assert(!FunSets.forall(t, x => x > 3), "Filter 3")
      assert(!FunSets.forall(t, x => x < 0), "Filter 4")
    }
  }

  @Test def `exists`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s, s3)
      assert(FunSets.exists(t, x => x == 1), "Exists 1")
      assert(FunSets.exists(t, x => x == 2), "Exists 2")
      assert(FunSets.exists(t, x => x == 3), "Exists 3")
      assert(FunSets.exists(t, x => x < 4), "Exists 4")
      assert(!FunSets.exists(t, x => x == 4), "Exists 5")
    }
  }

  @Test def `map`: Unit = {
    new TestSets {
      val s = union(s1, s2)
      val t = union(s, s3)
      val m = FunSets.map(t, x => 2 * x)
      printSet(m)
      assert(contains(m, 2), "Map 1")
      assert(contains(m, 4), "Map 2")
      assert(contains(m, 6), "Map 3")
      assert(!contains(m, 5), "Map 4")
      assert(!contains(m, 1), "Map 5")
    }
  }

  @Rule def individualTestTimeout = new org.junit.rules.Timeout(10 * 1000)
}
