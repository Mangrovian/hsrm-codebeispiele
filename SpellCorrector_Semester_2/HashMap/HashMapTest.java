
package de.hsrm.ads;

import org.junit.Test;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;


public class HashMapTest {

	double tolerance = 0.01;

	@Test
	public void testhashcode() {
		// a=97, b=98, c=99, d=100
		HashMap<Integer> m = new HashMap<Integer>(1000000, 100);
		assertEquals( m.hashcode("abc"), 979899);
		assertEquals( m.hashcode("!!!abc"), 979899);
		// check binary table
		m = new HashMap<Integer>(2, 2);
		assertEquals( m.hashcode("!!!abc"), 1);
		assertEquals( m.hashcode("!!!ab"), 0);
	}
	
	@Test
	public void testhashcodeOverflow() {
		// avoid overflow -> proper use of modulo
		HashMap<Integer> m = new HashMap<Integer>(100, 100);
		assertEquals( m.hashcode("cccccccccc"), 99);
		assertEquals( m.hashcode("dddddddddd"), 0);
		assertEquals( m.hashcode("eeeeeeeeee"), 1);
		assertEquals( m.hashcode("ffffffffff"), 2);
	}

	public void check(HashMap<Integer> m, int pos, String key, int value) {
		// check that table has (key,value) at position 'pos'
		assertTrue(m.table[pos].key.equals(key));
		assertTrue(m.table[pos].value==value);
	}

	public void checkGet(HashMap<Integer> m, String key, int value) {
		assertTrue(m.get(key) == value);
	}

	@Test
	public void testInsert() {
		// 9->57, C->67, M=77, W=87, 8I=297
		HashMap<Integer> m = new HashMap<Integer>(10, 4);
		m.add("9", 2);
		m.add("C", 10);
		check(m, 7, "9", 2);
		check(m, 8, "C", 10); // +1
		m.add("M", 8);
		check(m, 1, "M", 8); // +4
		m.add("M", -1);
		check(m, 1, "M", -1); // +4
		m.add("W", 7);
		check(m, 6, "W", 7); // +9
		m.add("8I", 17);
		check(m, 3, "8I", 17); // +16
	}

	@Test
	public void testInsertGetFull1() {
		// Tabelle mit 9 Einträgen. Können 9 Werte einfügen, danach nicht mehr. 
		HashMap<Integer> m = new HashMap<Integer>(9, 4);
		assertEquals(0./9 , m.fillRatio(), tolerance);
		assertEquals( true, m.add("A", 1) );
		assertEquals( true, m.add("B", 2) );
		assertEquals( true, m.add("C", 3) );
		assertEquals( true, m.add("D", 4) );
		assertEquals( true, m.add("E", 5) );

		assertEquals(5./9 , m.fillRatio(), tolerance);
		
		assertEquals( true, m.add("F", 6) );
		assertEquals( true, m.add("G", 7) );
		assertEquals( true, m.add("H", 8) );
		assertEquals( true, m.add("I", 9) );
		assertEquals( false, m.add("J", 10) );
		assertEquals( false, m.add("K", 11) );
		assertEquals( 1, (int)m.get("A"));
		assertEquals( 2, (int)m.get("B"));
		assertEquals( 3, (int)m.get("C"));
		assertEquals( 4, (int)m.get("D"));
		assertEquals( 5, (int)m.get("E"));
		assertEquals( 6, (int)m.get("F"));
		assertEquals( 7, (int)m.get("G"));
		assertEquals( 8, (int)m.get("H"));
		assertEquals( 9, (int)m.get("I"));
		assertEquals( null, m.get("J"));
		assertEquals( null, m.get("K"));
		
		assertEquals(1.0 , m.fillRatio(), tolerance);
	}

	@Test
	public void testGet() {
		// 9=57, C=67, M=77, W=87, 8I=297
		HashMap<Integer> m = new HashMap<Integer>(10, 4);
		m.add("9", 2);
		m.add("C", 10);
		m.add("M", 8);
		m.add("W", 0);
		m.add("8I", 17);
		assertEquals((int)m.get("9"), 2);
		assertEquals((int)m.get("W"), 0);
		assertEquals((int)m.get("C"), 10);
		assertEquals((int)m.get("M"), 8);
		assertEquals((int)m.get("8I"), 17);
	}

	@Test
	public void testSize() {
		// 9=57, C=67, M=77, W=87, 8I=297
		HashMap<Integer> m = new HashMap<Integer>(10, 4);
		m.add("9", 2);
		m.add("C", 10);
		m.add("M", 8);
		m.add("W", 0);
		m.add("8I", 17);
		assertEquals((int) m.size(), 5);
	}

}
