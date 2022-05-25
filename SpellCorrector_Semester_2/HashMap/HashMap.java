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
		int counter = 0;
		for (Entry e: table){
			if (e!=null) counter++;
		}
		return counter;
	}
	
	public double fillRatio() {
		double M = (double) this.size();
		return M/N;
	}


	List<T> toList() {
		List list = new LinkedList();
		for (Entry e: table){
			if (e!=null) list.add(e);
		}
		return list;
	}


	public int hashcode(String key) {
		int h = 0;
		for (int i = 0; i < key.length(); i++) {
			char c = key.charAt(i);
			h = (h*basis+c)%N;
		}
		return h;
	}


	public T get(String key) {
		int hash = hashcode(key);
		for (int i = 0; i < table.length; i++) {
			if  (table[hash].key == key) {
				return this.table[hash].value;
			}  else {
				hash = (hash+2*i+1)%N;
			}
		}
		return null;
	}


	public boolean add(String key, T value) {
		int hash = hashcode(key);
		for (int i = 0; i < table.length; i++) {
			if (table[hash] == null) { // wenn eine leere Stelle gefunden wird -> einfügen
				this.table[hash] = new Entry(key, value);
				return true;
			} else if (table[hash].key.equals(key)){ // wenn derselbe Key gefunden wird -> überschreiben
				table[hash].value = value;
				return true;
			} else {
				hash = (hash+2*i+1)%N; // Sondierung
			}
		}
		return false;
	}


}

