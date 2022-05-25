
package de.hsrm.ads;

import org.junit.Test;
//import org.testng.annotations.Test;

import static org.junit.Assert.assertTrue;

import java.util.List;

import static org.junit.Assert.assertEquals;


public class SpellCorrectorTest {

	
	public boolean equals(SpellCorrector.Entry e1, SpellCorrector.Entry e2) {
		return e1.nchanged() == e2.nchanged() &&
				e1.reducedWord.equals(e2.reducedWord) &&
				e1.origWord.equals(e2.origWord);
	}
	
	public void check(SpellCorrector.Entry[] expected, List<SpellCorrector.Entry> actual) {
		if (expected.length == 0 && actual == null)
			return;
		assertEquals(expected.length, actual.size());
		for (SpellCorrector.Entry a : actual) {
			boolean found = false;
			for (SpellCorrector.Entry e : expected) {
				if (equals(e, a)) {
					found = true;
					break;
				}
			}
			assertTrue(found);
		}
		for (SpellCorrector.Entry e : expected) {
			boolean found = false;
			for (SpellCorrector.Entry a : actual) {
				if (equals(e, a)) {
					found = true;
					break;
				}
			}
			assertTrue(found);
		}
	}
	
	
	// remove one char from "abc"
	@Test
	public void testGenerate1() {
		
		SpellCorrector sc = new SpellCorrector(1, 101, 10);
		List<SpellCorrector.Entry> actual = sc.generate("abc", sc.K);

		SpellCorrector.Entry[] expected = new SpellCorrector.Entry[] {
				new SpellCorrector.Entry("ab", "abc"),
				new SpellCorrector.Entry("ac", "abc"),
				new SpellCorrector.Entry("bc", "abc"),
				new SpellCorrector.Entry("abc", "abc"),				
		};
		check( expected, actual );
	}

	// remove up to two chars from "abc"
	@Test
	public void testGenerate2() {
		
		SpellCorrector sc = new SpellCorrector(2, 101, 10);
		List<SpellCorrector.Entry> actual = sc.generate("abc", sc.K);

		SpellCorrector.Entry[] expected = new SpellCorrector.Entry[] {
				new SpellCorrector.Entry("a", "abc"),
				new SpellCorrector.Entry("b", "abc"),
				new SpellCorrector.Entry("c", "abc"),
				new SpellCorrector.Entry("ab", "abc"),
				new SpellCorrector.Entry("ac", "abc"),
				new SpellCorrector.Entry("bc", "abc"),
				new SpellCorrector.Entry("abc", "abc"),				
		};
		check( expected, actual );
	}

	// remove up to three chars from "aaaaa!"
	@Test
	public void testGenerate4() {
		
		SpellCorrector sc = new SpellCorrector(3, 101, 10);
		List<SpellCorrector.Entry> actual = sc.generate("aaaaa!", sc.K);

		SpellCorrector.Entry[] expected = new SpellCorrector.Entry[] {
				new SpellCorrector.Entry("aa!", "aaaaa!"),
				new SpellCorrector.Entry("aaa", "aaaaa!"),
				new SpellCorrector.Entry("aaa!", "aaaaa!"),
				new SpellCorrector.Entry("aaaa", "aaaaa!"),
				new SpellCorrector.Entry("aaaa!", "aaaaa!"),
				new SpellCorrector.Entry("aaaaa", "aaaaa!"),
				new SpellCorrector.Entry("aaaaa!", "aaaaa!"),
		};
		check( expected, actual );
	}

	// remove up to three chars from "blabla"
	@Test
	public void testGenerate5() {
		
		SpellCorrector sc = new SpellCorrector(2, 101, 10);
		List<SpellCorrector.Entry> actual = sc.generate("blabla", sc.K);

		SpellCorrector.Entry[] expected = new SpellCorrector.Entry[] {

				new SpellCorrector.Entry("abla", "blabla"),

				new SpellCorrector.Entry("lbla", "blabla"),
				new SpellCorrector.Entry("lala", "blabla"),
				new SpellCorrector.Entry("laba", "blabla"),
				new SpellCorrector.Entry("labl", "blabla"),

				new SpellCorrector.Entry("bbla", "blabla"),
				new SpellCorrector.Entry("baba", "blabla"),
				new SpellCorrector.Entry("babl", "blabla"),				
				new SpellCorrector.Entry("bala", "blabla"),
				new SpellCorrector.Entry("blaa", "blabla"),
				new SpellCorrector.Entry("blab", "blabla"),
				new SpellCorrector.Entry("blal", "blabla"),
				new SpellCorrector.Entry("blba", "blabla"),
				new SpellCorrector.Entry("blbl", "blabla"),
				new SpellCorrector.Entry("blla", "blabla"),

				new SpellCorrector.Entry("labla", "blabla"),
				new SpellCorrector.Entry("babla", "blabla"),
				new SpellCorrector.Entry("blbla", "blabla"),
				new SpellCorrector.Entry("blala", "blabla"),
				new SpellCorrector.Entry("blaba", "blabla"),
				new SpellCorrector.Entry("blabl", "blabla"),

				new SpellCorrector.Entry("blabla", "blabla"),
		};
		
		check( expected, actual );
	}

	public void check(String[] expected, List<String> actual) {
		assertEquals(expected.length, actual.size());
		for (String e : expected) {
			boolean found = false;
			for (String a : actual) {
				if (e.equals(a)) {
					found = true;
					break;
				}
			}
			assertTrue(found);
		}
	}
	
	// tiny first test
	@Test
	public void testMatch1() {

		List<String> actual;
		String[] expected;
		SpellCorrector sc = new SpellCorrector(3, 1001, 31);
		sc.add("abc");
		sc.add("def");
		sc.add("ghi");
		
		// abc -> abc
		actual = sc.match("abc");
		expected = new String[] {"abc"};
		check(expected, actual);

		// ab -> abc
		actual = sc.match("ab");
		expected = new String[] {"abc"};
		check(expected, actual);

		// f -> def
		actual = sc.match("f");
		expected = new String[] {"def"};
		check(expected, actual);

		// "" -> abc, def, ghi
		actual = sc.match("");
		expected = new String[] {"abc", "def", "ghi"};
		check(expected, actual);

	}

	// tiny test: cannot find if too few changes in index
	@Test
	public void testMatch2() {

		List<String> actual;
		String[] expected;
		SpellCorrector sc = new SpellCorrector(1, 1001, 31);
		sc.add("abc");
		sc.add("def");
		sc.add("ghi");

		// ab -> abc
		actual = sc.match("ab");
		expected = new String[] {"abc"};
		check(expected, actual);
		
		// a -> abc
		actual = sc.match("a");
		expected = new String[] {};
		check(expected, actual);
	}

	// a more realistic test (switch from cherry to raspberry)
	@Test
	public void testMatch4() {

		List<String> actual;
		String[] expected;
		SpellCorrector sc = new SpellCorrector(5, 1001, 31);
		sc.add("banana");
		sc.add("apple");
		sc.add("cherry");
		sc.add("raspberry");

		actual = sc.match("aple");
		expected = new String[] {"apple"};
		check(expected, actual);

		actual = sc.match("anan");
		expected = new String[] {"banana"};
		check(expected, actual);

		actual = sc.match("err");
		expected = new String[] {"cherry"};
		check(expected, actual);

		actual = sc.match("erry");
		expected = new String[] {"cherry"};
		check(expected, actual);

		actual = sc.match("pberry");
		expected = new String[] {"raspberry"};
		check(expected, actual);

		actual = sc.match("spberry");
		expected = new String[] {"raspberry"};
		check(expected, actual);
	}

	
	// a more realistic test (multi-matches)
	@Test
	public void testMatch5() {

		List<String> actual;
		String[] expected;
		SpellCorrector sc = new SpellCorrector(5, 1001, 31);
		sc.add("raspberry");
		sc.add("blueberry");
		sc.add("cranberry");

		actual = sc.match("berry");
		expected = new String[] {"raspberry", "blueberry", "cranberry"};
		check(expected, actual);

		actual = sc.match("rberry");
		expected = new String[] {"raspberry", "cranberry"};
		check(expected, actual);

		actual = sc.match("raberry");
		expected = new String[] {"raspberry", "cranberry"};
		check(expected, actual);

		actual = sc.match("craberry");
		expected = new String[] {"cranberry"};
		check(expected, actual);
	}

	// matching against empty string.
	@Test
	public void testMatch6() {
		
		List<String> actual;
		String[] expected;
		SpellCorrector sc = new SpellCorrector(5, 1001, 31);
		sc.add("");
		sc.add("b");

		actual = sc.match("a");
		expected = new String[] {""};
		check(expected, actual);
	}
	
}
