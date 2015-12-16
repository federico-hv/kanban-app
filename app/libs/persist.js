import makeFinalStore from 'alt/utils/makeFinalStore';

export default function(alt, storage, storeName) {
  const finalStore = makeFinalStore(alt); //Sends alt instance to FinalStore for persistence

  try {
    alt.bootstrap(storage.get(storeName)); //retrieves last snapshot from localStorage
  }
  catch(e) {
    console.error('Failed to bootstrap data', e);
  }

  finalStore.listen(() => {
    if(!storage.get('debug')) {
      storage.set(storeName, alt.takeSnapshot());
    }
  });
}
