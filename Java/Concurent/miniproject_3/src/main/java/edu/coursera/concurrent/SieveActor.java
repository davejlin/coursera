package edu.coursera.concurrent;

import static edu.rice.pcdp.PCDP.finish;

import edu.rice.pcdp.Actor;

/**
 * An actor-based implementation of the Sieve of Eratosthenes.
 *
 * TODO Fill in the empty SieveActorActor actor class below and use it from
 * countPrimes to determin the number of primes <= limit.
 */
public final class SieveActor extends Sieve {
    /**
     * {@inheritDoc}
     *
     * TODO Use the SieveActorActor class to calculate the number of primes <=
     * limit in parallel. You might consider how you can model the Sieve of
     * Eratosthenes as a pipeline of actors, each corresponding to a single
     * prime number.
     */
    @Override
    public int countPrimes(final int limit) {
    		final SieveActorActor sieveActor = new SieveActorActor(2);
    		finish( () -> {
	        for(int i = 3; i <= limit; i += 2) {
        			sieveActor.send(i);	
	        	}
	        sieveActor.send(0);
    		});
        
        int nPrimes = 0;
        SieveActorActor loopActor = sieveActor;
        while (loopActor != null) {
        		nPrimes += loopActor.numLocalPrimes();
        		loopActor = loopActor.nextActor();
        }
        
        return nPrimes;
    }

    /**
     * An actor class that helps implement the Sieve of Eratosthenes in
     * parallel.
     * 
     * Optimizations:
     * 
     * Note:  1)  doesn't seem to help:
     * 
     * 1) Since each actor filter numbers, the next actor receives fewer values than the previous, so the work load is divided unevenly between actors. 
     * To more evenly distribute the load, increase maxLocalPrimes for each next actor. 
     * The exponential function is most efficient in this case: 
     * Start first actor with maxLocalPrimes = 1 and multiply by two for each next actor.
     * 
     * 2) Store the square of minimal prime number that is checked by current actor, and immediately return true for IsLocalyPrime method 
     * if the candidate is smaller than the square. 
     * Let say n is the candidate, and minPrime is the minimal prime of the current actor. 
     * Since the current actor has received n, it means n is not divisible by any prime < minPrime. 
     * Lets say, that it is divisible by minPrime => (n / minPrime = k >= minPrime) => n > minPrime * minPrime which is wrong, since n < Square(minPrime)
     */
    public static final class SieveActorActor extends Actor {
    		private int maxLocalPrimes = 25;
    		private final int[] localPrimes;
    		private int nLocalPrimes;
    		private int squareOfMinimalPrime;
    		private SieveActorActor nextActor;
    		
    		public SieveActorActor nextActor() { return nextActor; }
    		public int numLocalPrimes() { return nLocalPrimes; }
    		
    		SieveActorActor(final int localPrime) {
    			this.localPrimes = new int[maxLocalPrimes];
    			this.localPrimes[0] = localPrime;
    			this.nLocalPrimes = 1;
    			this.squareOfMinimalPrime = localPrime * localPrime;
    			this.nextActor = null;
    		}    	
    	
        /**
         * Process a single message sent to this actor.
         *
         * TODO complete this method.
         *
         * @param msg Received message
         */
        @Override
        public void process(final Object msg) {
            final int candidate = (Integer) msg;
            if (candidate <= 0) {
            		if (nextActor != null) {
            			nextActor.send(msg);
            		}
            } else {
            		final boolean locallyPrime = isLocallyPrime(candidate);
            		if (locallyPrime) {
            			if (nLocalPrimes < maxLocalPrimes) {
                    		localPrimes[nLocalPrimes] = candidate;
                			nLocalPrimes += 1;
            			} else if (nextActor == null) {
                			nextActor = new SieveActorActor(candidate);
                		} else {
                			nextActor.send(candidate);
                		}
            		}
            }
        }
        
        private boolean isLocallyPrime(final int candidate) {
        		if (candidate < squareOfMinimalPrime) { return true; }
        		
        		for (int i = 0; i < nLocalPrimes; i++) {
        			if (candidate % localPrimes[i] == 0) {
        				return false;
        			}
        		}
        		
        		return true;
        }
    }
}
