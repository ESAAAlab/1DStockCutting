// http://www.martinbroadhurst.com/bin-packing.html

function next_fit(binSize, items, bins) {
  var bin = 0;
  var capacity = binSize;
  for (var item = 0; item < items.length; item ++) {
    if (items[item] > capacity) {
      bin++;
      capacity = binSize;
    }
    capacity -= items[item];
    bins[item] = bin;
  }
  return bin+1;
}

function first_fit(binsize, items, bins) {
  var bins_used = 1;
  var binarray = new Array(items.length);
  if (binarray === undefined) {
      return 0;
  }
  binarray[0] = binsize;
  for (var item = 0; item < items.length; item++) {
    var added = 0;
    for (var bin = 0; bin < bins_used && !added; bin++) {
      if (binarray[bin] >= items[item]) {
        /* Add to this bin */
        binarray[bin] -= items[item];
        bins[item] = bin;
        added = 1;
      }
    }
    if (!added) {
      /* Create a new bin and add to it */
      binarray[bins_used] = binsize - items[item];
      bins[item] = bins_used;
      bins_used++;
    }
  }
  return bins_used;
}

function superlative_fit(binsize, items, bins, fit) {
  var bins_used = 1;
  var binarray = new Array(items.length);
  if (binarray === undefined) {
    return 0;
  }
  binarray[0] = binsize;
  for (var item = 0; item < items.length; item++) {
    var candidate = -1; /* Candidate bin */
    var capacity = 0;   /* Capacity of the candidate bin */
    for (var bin = 0; bin < bins_used; bin++) {
      /* Does this bin have enough capacity? */
      if (binarray[bin] >= items[item]) {
        /* Is it the best/worst fit seen so far? */
        if (candidate == -1 || 
          ((fit == "BEST" && binarray[bin] < capacity) ||
          (fit == "WORST" && binarray[bin] > capacity))) {
            candidate = bin;
            capacity = binarray[bin];
        }
      }
    }
    if (candidate != -1) {
      /* Add to candidate bin */
      binarray[candidate] -= items[item];
      bins[item] = candidate;
    }
    else {
      /* Create a new bin and add to it */
      binarray[bins_used] = binsize - items[item];
      bins[item] = bins_used;
      bins_used++;
    }
  }
  return bins_used;
}

function best_fit(binsize, items, bins) {
  return superlative_fit(binsize, items, bins, "BEST");
}

function worst_fit(binsize, items, bins) {
  return superlative_fit(binsize, items, bins, "WORST");
}

function first_fit_decreasing(binsize, items, bins) {
  items.sort(function(a, b) {
    return b - a;
  });
  return first_fit(binsize, items, bins);
}

function best_fit_decreasing(binsize, items, bins) {
  items.sort(function(a, b) {
    return b - a;
  });
  return best_fit(binsize, items, bins);
}

function worst_fit_decreasing(binsize, items, bins) {
  items.sort(function(a, b) {
    return b - a;
  });
  return worst_fit(binsize, items, bins);
}
