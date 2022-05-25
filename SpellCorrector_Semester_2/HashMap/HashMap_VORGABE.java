package de.hsrm.ads;

import java.lang.reflect.Array;
import java.util.LinkedList;
import java.util.List;

public class HashMap<T> {

	public class Entry {
		String key;
		T value;

		public Entry(String key, T value) {
			this.key = key;
			this.value = value;
		}
	}

	// the hash table
	Entry[] table;

	// size of the hash table
	int N;

	// used to hash strings with the Horner schema.
	int basis;

	public HashMap(int N, int basis) {
		table = (Entry[]) Array.newInstance(Entry[].class.getComponentType(), N);
		this.basis = basis;
		this.N = N;
	}

	public int size() {
		// FIXME
	}
	
	public double fillRatio() {
		// FIXME
	}
	
	List<T> toList() {
		// FIXME
	}
	
	public int hashcode(String key) {
		// FIXME
	}

	public T get(String key) {
		// FIXME
	}

	public boolean add(String key, T value) {
		// FIXME
	}

}

