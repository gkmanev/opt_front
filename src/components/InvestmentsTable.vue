<template>
  <section class="card table-card">
    <header>
      <div>
        <h3>Weekly Options Ideas</h3>
        <p class="subtle">Screened options from the custom filter feed.</p>
      </div>
      <button class="ghost" type="button">Export</button>
    </header>
    <div class="table-filters">
      <div class="filter-group">
        <div class="filter-header">
          <span>Price range</span>
          <strong>
            ${{ formatFilterValue(localMinPrice) }} - ${{ formatFilterValue(localMaxPrice) }}
          </strong>
        </div>
        <div class="filter-controls">
          <div class="range-slider">
            <div class="range-track">
              <span class="range-selection" :style="rangeSelectionStyle"></span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              :value="localMinPrice"
              @input="onMinPriceInput"
            />
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              :value="localMaxPrice"
              @input="onMaxPriceInput"
            />
          </div>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-header">
          <span>RSI range</span>
          <strong>{{ formatFilterValue(localMinRsi) }} - {{ formatFilterValue(localMaxRsi) }}</strong>
        </div>
        <div class="filter-controls">
          <div class="range-slider">
            <div class="range-track">
              <span class="range-selection" :style="rsiRangeSelectionStyle"></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="localMinRsi"
              @input="onMinRsiInput"
            />
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="localMaxRsi"
              @input="onMaxRsiInput"
            />
          </div>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-header">
          <span>Min ROI</span>
          <strong>{{ roiLabel }}</strong>
        </div>
        <div class="filter-controls">
          <select class="select" :value="localMinRoi" @change="onMinRoiChange">
            <option value="">Any ROI</option>
            <option value="2">&gt; 2%</option>
            <option value="2.5">&gt; 2.5%</option>
            <option value="3">&gt; 3%</option>
          </select>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-header">
          <span>Prob. of expiration</span>
          <strong>{{ expirationLabel }}</strong>
        </div>
        <div class="filter-controls">
          <select class="select" :value="localMinExpiration" @change="onMinExpirationChange">
            <option value="">Any</option>
            <option value="70">&gt; 70%</option>
            <option value="75">&gt; 75%</option>
            <option value="80">&gt; 80%</option>
          </select>
        </div>
      </div>
    </div>
    <div class="filter-actions">
      <button class="ghost" type="button" :disabled="!hasFilterChanges" @click="applyAllFilters">
        Apply
      </button>
      <button class="ghost" type="button" :disabled="!hasDefaultChanges" @click="resetAllFilters">
        Reset
      </button>
    </div>
    <div class="table investments-table">
      <div class="table-row table-head">
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'ticker' }"
          @click="toggleSort('ticker')"
        >
          Ticker
          <span class="sort-indicator">{{ sortIndicator('ticker') }}</span>
        </button>
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'expDate' }"
          @click="toggleSort('expDate')"
        >
          Exp. Date
          <span class="sort-indicator">{{ sortIndicator('expDate') }}</span>
        </button>
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'price' }"
          @click="toggleSort('price')"
        >
          Price
          <span class="sort-indicator">{{ sortIndicator('price') }}</span>
        </button>
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'delta' }"
          @click="toggleSort('delta')"
        >
          Delta
          <span class="sort-indicator">{{ sortIndicator('delta') }}</span>
        </button>
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'rsi' }"
          @click="toggleSort('rsi')"
        >
          RSI
          <span class="sort-indicator">{{ sortIndicator('rsi') }}</span>
        </button>
        <button
          class="table-sort"
          type="button"
          :class="{ active: sortKey === 'roi' }"
          @click="toggleSort('roi')"
        >
          ROI
          <span class="sort-indicator">{{ sortIndicator('roi') }}</span>
        </button>
      </div>
      <div v-for="idea in paginatedInvestments" :key="ideaKey(idea)" class="table-row">
        <span class="ticker">
          <strong>{{ idea.ticker ?? '—' }}</strong>
        </span>
        <span>{{ formatDate(idea.exp_date ?? idea.expiration_date ?? idea.expDate) }}</span>
        <span>{{ formatNumber(idea.price) }}</span>
        <span :class="numberClass(idea.delta)">{{ formatNumber(idea.delta, true) }}</span>
        <span :class="numberClass(idea.rsi)">{{ formatNumber(idea.rsi) }}</span>
        <span :class="numberClass(idea.roi)">{{ formatNumber(idea.roi, true) }}</span>
      </div>
      <p v-if="!investments.length" class="subtle">No weekly options ideas available.</p>
    </div>
    <div v-if="investments.length" class="table-pagination">
      <p class="subtle">
        Showing {{ pageStart }}-{{ pageEnd }} of {{ sortedInvestments.length }}
      </p>
      <div class="pagination-controls">
        <button
          class="ghost"
          type="button"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="ghost"
          type="button"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  investments: {
    type: Array,
    required: true,
  },
  minPrice: {
    type: Number,
    default: 0,
  },
  maxPrice: {
    type: Number,
    default: 200,
  },
  minRsi: {
    type: Number,
    default: 0,
  },
  maxRsi: {
    type: Number,
    default: 100,
  },
  minRoi: {
    type: Number,
    default: null,
  },
  minDelta: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits([
  'update:minPrice',
  'update:maxPrice',
  'update:minRsi',
  'update:maxRsi',
  'update:minRoi',
  'update:minDelta',
]);

const sortKey = ref('expDate');
const sortDirection = ref('asc');
const currentPage = ref(1);
const pageSize = ref(6);
const localMinPrice = ref(props.minPrice);
const localMaxPrice = ref(props.maxPrice);
const localMinRsi = ref(props.minRsi);
const localMaxRsi = ref(props.maxRsi);
const localMinRoi = ref(
  props.minRoi === null || props.minRoi === undefined ? '' : String(props.minRoi),
);
const localMinExpiration = ref(
  props.minDelta === null || props.minDelta === undefined
    ? ''
    : String(100 + Number(props.minDelta) * 100),
);
const defaultMinPrice = 0;
const defaultMaxPrice = 200;
const defaultMinRsi = 0;
const defaultMaxRsi = 100;
const defaultMinRoi = '';
const defaultMinExpiration = '';

const expirationThreshold = (minDelta) => {
  if (minDelta === null || minDelta === undefined || minDelta === '') {
    return '';
  }
  const deltaValue = Number(minDelta);
  if (Number.isNaN(deltaValue)) {
    return '';
  }
  return String(100 + deltaValue * 100);
};

const columns = [
  {
    key: 'ticker',
    type: 'string',
    getValue: (idea) => idea.ticker ?? '',
  },
  {
    key: 'expDate',
    type: 'date',
    getValue: (idea) => idea.exp_date ?? idea.expiration_date ?? idea.expDate,
  },
  {
    key: 'price',
    type: 'number',
    getValue: (idea) => idea.price,
  },
  {
    key: 'delta',
    type: 'number',
    getValue: (idea) => idea.delta,
  },
  {
    key: 'rsi',
    type: 'number',
    getValue: (idea) => idea.rsi,
  },
  {
    key: 'roi',
    type: 'number',
    getValue: (idea) => idea.roi,
  },
];

const columnByKey = new Map(columns.map((column) => [column.key, column]));

const ideaKey = (idea) =>
  `${idea.ticker ?? 'unknown'}-${idea.exp_date ?? idea.expiration_date ?? idea.expDate ?? ''}-${idea.strike ?? ''}`;

const normalizedSortValue = (column, idea) => {
  const rawValue = column.getValue(idea);
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return column.type === 'string' ? '' : Number.NEGATIVE_INFINITY;
  }
  if (column.type === 'date') {
    const timestamp = Date.parse(rawValue);
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
  }
  if (column.type === 'number') {
    const number = Number(rawValue);
    return Number.isNaN(number) ? Number.NEGATIVE_INFINITY : number;
  }
  return String(rawValue).toLowerCase();
};

const sortedInvestments = computed(() => {
  const column = columnByKey.get(sortKey.value);
  if (!column) return [...props.investments];
  const direction = sortDirection.value === 'asc' ? 1 : -1;
  return [...props.investments].sort((first, second) => {
    const firstValue = normalizedSortValue(column, first);
    const secondValue = normalizedSortValue(column, second);
    if (firstValue === secondValue) return 0;
    return firstValue > secondValue ? direction : -direction;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedInvestments.value.length / pageSize.value)),
);

const paginatedInvestments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedInvestments.value.slice(start, start + pageSize.value);
});

const pageStart = computed(() =>
  sortedInvestments.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0,
);

const pageEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, sortedInvestments.value.length),
);

const rangeSelectionStyle = computed(() => {
  const min = Number(localMinPrice.value);
  const max = Number(localMaxPrice.value);
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return { left: '0%', width: '100%' };
  }
  const clampedMin = Math.min(Math.max(min, 0), 200);
  const clampedMax = Math.min(Math.max(max, 0), 200);
  const start = Math.min(clampedMin, clampedMax);
  const end = Math.max(clampedMin, clampedMax);
  const left = (start / 200) * 100;
  const width = ((end - start) / 200) * 100;
  return { left: `${left}%`, width: `${width}%` };
});

const rsiRangeSelectionStyle = computed(() => {
  const min = Number(localMinRsi.value);
  const max = Number(localMaxRsi.value);
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return { left: '0%', width: '100%' };
  }
  const clampedMin = Math.min(Math.max(min, 0), 100);
  const clampedMax = Math.min(Math.max(max, 0), 100);
  const start = Math.min(clampedMin, clampedMax);
  const end = Math.max(clampedMin, clampedMax);
  const left = (start / 100) * 100;
  const width = ((end - start) / 100) * 100;
  return { left: `${left}%`, width: `${width}%` };
});

const hasPriceChanges = computed(
  () =>
    Number(localMinPrice.value) !== Number(props.minPrice) ||
    Number(localMaxPrice.value) !== Number(props.maxPrice),
);

const hasRsiChanges = computed(
  () =>
    Number(localMinRsi.value) !== Number(props.minRsi) ||
    Number(localMaxRsi.value) !== Number(props.maxRsi),
);

const hasRoiChanges = computed(
  () => String(localMinRoi.value ?? '') !== String(props.minRoi ?? ''),
);

const hasExpirationChanges = computed(
  () => String(localMinExpiration.value ?? '') !== String(expirationThreshold(props.minDelta) ?? ''),
);

const hasFilterChanges = computed(
  () =>
    hasPriceChanges.value ||
    hasRsiChanges.value ||
    hasRoiChanges.value ||
    hasExpirationChanges.value,
);

const hasDefaultChanges = computed(
  () =>
    Number(localMinPrice.value) !== defaultMinPrice ||
    Number(localMaxPrice.value) !== defaultMaxPrice ||
    Number(localMinRsi.value) !== defaultMinRsi ||
    Number(localMaxRsi.value) !== defaultMaxRsi ||
    String(localMinRoi.value ?? '') !== defaultMinRoi ||
    String(localMinExpiration.value ?? '') !== defaultMinExpiration,
);

const roiLabel = computed(() => {
  if (localMinRoi.value === '' || localMinRoi.value === null) {
    return 'Any';
  }
  return `> ${localMinRoi.value}%`;
});

const expirationLabel = computed(() => {
  if (localMinExpiration.value === '' || localMinExpiration.value === null) {
    return 'Any';
  }
  return `> ${localMinExpiration.value}%`;
});

const formatFilterValue = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '0';
  return number.toFixed(0);
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatNumber = (value, isPercent = false) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(number);
  return isPercent ? `${formatted}%` : formatted;
};

const numberClass = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '';
  if (number > 0) return 'positive';
  if (number < 0) return 'negative';
  return '';
};

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
};

const sortIndicator = (key) => {
  if (sortKey.value !== key) return '↕';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const goToPage = (page) => {
  const next = Math.min(Math.max(page, 1), totalPages.value);
  currentPage.value = next;
};

const onMinPriceInput = (event) => {
  const nextValue = Number(event.target.value);
  if (Number.isNaN(nextValue)) return;
  localMinPrice.value = nextValue;
  if (nextValue > localMaxPrice.value) {
    localMaxPrice.value = nextValue;
  }
};

const onMaxPriceInput = (event) => {
  const nextValue = Number(event.target.value);
  if (Number.isNaN(nextValue)) return;
  localMaxPrice.value = nextValue;
  if (nextValue < localMinPrice.value) {
    localMinPrice.value = nextValue;
  }
};

const applyPriceFilter = () => {
  emit('update:minPrice', localMinPrice.value);
  emit('update:maxPrice', localMaxPrice.value);
};

const onMinRsiInput = (event) => {
  const nextValue = Number(event.target.value);
  if (Number.isNaN(nextValue)) return;
  localMinRsi.value = nextValue;
  if (nextValue > localMaxRsi.value) {
    localMaxRsi.value = nextValue;
  }
};

const onMaxRsiInput = (event) => {
  const nextValue = Number(event.target.value);
  if (Number.isNaN(nextValue)) return;
  localMaxRsi.value = nextValue;
  if (nextValue < localMinRsi.value) {
    localMinRsi.value = nextValue;
  }
};

const applyRsiFilter = () => {
  emit('update:minRsi', localMinRsi.value);
  emit('update:maxRsi', localMaxRsi.value);
};

const onMinRoiChange = (event) => {
  localMinRoi.value = event.target.value;
};

const applyRoiFilter = () => {
  if (localMinRoi.value === '' || localMinRoi.value === null) {
    emit('update:minRoi', null);
    return;
  }
  const parsed = Number(localMinRoi.value);
  emit('update:minRoi', Number.isNaN(parsed) ? null : parsed);
};

const onMinExpirationChange = (event) => {
  localMinExpiration.value = event.target.value;
};

const applyExpirationFilter = () => {
  if (localMinExpiration.value === '' || localMinExpiration.value === null) {
    emit('update:minDelta', null);
    return;
  }
  const parsed = Number(localMinExpiration.value);
  if (Number.isNaN(parsed)) {
    emit('update:minDelta', null);
    return;
  }
  const minDeltaValue = (parsed - 100) / 100;
  emit('update:minDelta', minDeltaValue);
};

const applyAllFilters = () => {
  applyPriceFilter();
  applyRsiFilter();
  applyRoiFilter();
  applyExpirationFilter();
};

const resetAllFilters = () => {
  localMinPrice.value = defaultMinPrice;
  localMaxPrice.value = defaultMaxPrice;
  localMinRsi.value = defaultMinRsi;
  localMaxRsi.value = defaultMaxRsi;
  localMinRoi.value = defaultMinRoi;
  localMinExpiration.value = defaultMinExpiration;
  emit('update:minPrice', defaultMinPrice);
  emit('update:maxPrice', defaultMaxPrice);
  emit('update:minRsi', defaultMinRsi);
  emit('update:maxRsi', defaultMaxRsi);
  emit('update:minRoi', null);
  emit('update:minDelta', null);
};

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

watch(
  () => props.minPrice,
  (value) => {
    localMinPrice.value = value;
  },
);

watch(
  () => props.maxPrice,
  (value) => {
    localMaxPrice.value = value;
  },
);

watch(
  () => props.minRsi,
  (value) => {
    localMinRsi.value = value;
  },
);

watch(
  () => props.maxRsi,
  (value) => {
    localMaxRsi.value = value;
  },
);

watch(
  () => props.minRoi,
  (value) => {
    localMinRoi.value = value === null || value === undefined ? '' : String(value);
  },
);

watch(
  () => props.minDelta,
  (value) => {
    localMinExpiration.value = expirationThreshold(value);
  },
);
</script>
