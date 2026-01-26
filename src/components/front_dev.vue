<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto max-w-7xl px-6 py-6">
      <!-- Page Header -->
      <header class="mb-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight">Put Opportunities</h1>
            <p class="mt-1 text-sm text-slate-300">
              Sell puts on stocks where owning the shares is an acceptable outcome.
            </p>
          </div>
          <div class="hidden sm:flex items-center gap-2">
            <span
              class="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300 ring-1 ring-slate-800"
            >
              Updated: {{ nowLabel }}
            </span>
          </div>
        </div>

        <!-- Info banner -->
        <div
          v-if="showBanner"
          class="mt-4 flex items-start justify-between gap-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800"
        >
          <div class="flex gap-3">
            <div class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-800">
              <span class="text-slate-200">i</span>
            </div>
            <div>
              <p class="text-sm font-medium">Reminder</p>
              <p class="mt-1 text-sm text-slate-300">
                Selling puts works best when you’re comfortable owning the underlying stock.
              </p>
            </div>
          </div>
          <button
            class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60"
            @click="showBanner = false"
          >
            Dismiss
          </button>
        </div>
      </header>

      <!-- Filters -->
      <FiltersBar v-model="filters" :assignmentOptions="assignmentOptions" class="mb-4" />

      <!-- Table -->
      <OpportunitiesTable :rows="filteredRows" @select="openDrawer" />

      <!-- Drawer -->
      <StockDrawer :open="drawerOpen" :row="selectedRow" @close="drawerOpen = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, defineComponent } from "vue";

defineOptions({
  name: "FrontDev",
});

type AssignmentUI =
  | "Favorable assignment"
  | "Selective assignment"
  | "Unfavorable assignment";

type ClassificationBackend = "Wheel-Ready" | "Watchlist" | "Avoid for Puts";

type AgentReport = {
  ticker: string;
  great_company_score: number;
  classification: ClassificationBackend;
  summary: string;
  cash_flow: {
    fcf_status: "positive" | "mixed" | "negative";
    fcf_trend: "stable" | "volatile_but_resilient" | "deteriorating";
    earnings_quality: "strong" | "acceptable" | "weak";
  };
  balance_sheet: {
    leverage_level: "low" | "moderate" | "elevated";
    liquidity: "strong" | "adequate" | "weak";
    dilution_risk: "low" | "moderate" | "high";
  };
  profitability: {
    earnings_consistency: "stable" | "cyclical_positive" | "unstable";
    margin_profile: "stable" | "cyclical" | "compressed";
  };
  risk_flags: string[];
  put_selling_guidance: {
    assignment_tolerance: "high" | "moderate" | "low";
    recommended_delta_range: [number, number];
    earnings_caution: boolean;
  };
};

type ScreenerRow = {
  ticker: string;
  company: string;
  price: number;
  strike: number;
  dte: number;
  delta: number;
  premium: number;
  monthlyReturnPct: number;
  report: AgentReport;
};

const nowLabel = new Date().toLocaleString();

const showBanner = ref(true);
const drawerOpen = ref(false);
const selectedRow = ref<ScreenerRow | null>(null);

const assignmentOptions: AssignmentUI[] = [
  "Favorable assignment",
  "Selective assignment",
  "Unfavorable assignment",
];

const filters = reactive({
  assignmentProfile: new Set<AssignmentUI>([
    "Favorable assignment",
    "Selective assignment",
  ]),
  dteMin: 7,
  dteMax: 45,
  deltaMin: -0.45,
  deltaMax: -0.15,
  minMonthlyReturnPct: 1.5,
});

function mapClassificationToUI(c: ClassificationBackend): AssignmentUI {
  if (c === "Wheel-Ready") return "Favorable assignment";
  if (c === "Watchlist") return "Selective assignment";
  return "Unfavorable assignment";
}

/**
 * Mock data – replace with API results.
 * Expect your backend to return opportunity rows + the full agent report per ticker.
 */
const rows = ref<ScreenerRow[]>([
  {
    ticker: "MSFT",
    company: "Microsoft",
    price: 412.0,
    strike: 395,
    dte: 28,
    delta: -0.29,
    premium: 4.8,
    monthlyReturnPct: 2.3,
    report: {
      ticker: "MSFT",
      great_company_score: 88,
      classification: "Wheel-Ready",
      summary:
        "Durable cash generation and strong balance sheet make ownership after assignment acceptable.",
      cash_flow: {
        fcf_status: "positive",
        fcf_trend: "stable",
        earnings_quality: "strong",
      },
      balance_sheet: {
        leverage_level: "low",
        liquidity: "strong",
        dilution_risk: "low",
      },
      profitability: { earnings_consistency: "stable", margin_profile: "stable" },
      risk_flags: [],
      put_selling_guidance: {
        assignment_tolerance: "high",
        recommended_delta_range: [-0.35, -0.25],
        earnings_caution: false,
      },
    },
  },
  {
    ticker: "GLW",
    company: "Corning",
    price: 33.0,
    strike: 31,
    dte: 21,
    delta: -0.34,
    premium: 0.85,
    monthlyReturnPct: 2.7,
    report: {
      ticker: "GLW",
      great_company_score: 75,
      classification: "Watchlist",
      summary: "Solid fundamentals with cyclicality; use conservative strikes and timing.",
      cash_flow: {
        fcf_status: "positive",
        fcf_trend: "volatile_but_resilient",
        earnings_quality: "acceptable",
      },
      balance_sheet: {
        leverage_level: "moderate",
        liquidity: "adequate",
        dilution_risk: "low",
      },
      profitability: {
        earnings_consistency: "cyclical_positive",
        margin_profile: "cyclical",
      },
      risk_flags: ["Cyclical earnings", "Moderate leverage"],
      put_selling_guidance: {
        assignment_tolerance: "moderate",
        recommended_delta_range: [-0.35, -0.25],
        earnings_caution: true,
      },
    },
  },
  {
    ticker: "RBRK",
    company: "Rubrik",
    price: 58.0,
    strike: 50,
    dte: 14,
    delta: -0.42,
    premium: 3.1,
    monthlyReturnPct: 5.2,
    report: {
      ticker: "RBRK",
      great_company_score: 45,
      classification: "Avoid for Puts",
      summary:
        "Business and cash-flow durability are not yet proven; ownership after assignment is high risk.",
      cash_flow: {
        fcf_status: "negative",
        fcf_trend: "deteriorating",
        earnings_quality: "weak",
      },
      balance_sheet: {
        leverage_level: "elevated",
        liquidity: "adequate",
        dilution_risk: "high",
      },
      profitability: {
        earnings_consistency: "unstable",
        margin_profile: "compressed",
      },
      risk_flags: ["Unproven cash flow", "Potential dilution risk"],
      put_selling_guidance: {
        assignment_tolerance: "low",
        recommended_delta_range: [-0.25, -0.15],
        earnings_caution: true,
      },
    },
  },
]);

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const profile = mapClassificationToUI(r.report.classification);
    if (!filters.assignmentProfile.has(profile)) return false;
    if (r.dte < filters.dteMin || r.dte > filters.dteMax) return false;
    if (r.delta < filters.deltaMin || r.delta > filters.deltaMax) return false;
    if (r.monthlyReturnPct < filters.minMonthlyReturnPct) return false;
    return true;
  });
});

function openDrawer(row: ScreenerRow) {
  selectedRow.value = row;
  drawerOpen.value = true;
}

/** ---------- Tooltip ---------- */
const Tooltip = {
  props: { text: { type: String, required: true } },
  template: `
    <span class="relative group inline-flex">
      <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-200 ring-1 ring-slate-700 cursor-default">i</span>
      <span
        class="pointer-events-none absolute left-1/2 top-7 z-50 w-72 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition
               rounded-xl bg-slate-900 p-3 text-xs text-slate-200 ring-1 ring-slate-700 shadow-xl"
      >{{ text }}</span>
    </span>
  `,
};

/** ---------- FiltersBar ---------- */
const FiltersBar = defineComponent({
  name: "FiltersBar",
  components: { Tooltip },
  props: {
    modelValue: { type: Object as any, required: true },
    assignmentOptions: { type: Array as any, required: true },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const local = props.modelValue;

    function toggleAssignment(opt: string) {
      const s: Set<string> = local.assignmentProfile;
      if (s.has(opt)) s.delete(opt);
      else s.add(opt);
      emit("update:modelValue", local);
    }

    return { local, toggleAssignment };
  },
  template: `
    <div class="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 w-full">
          <!-- Assignment profile -->
          <div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">Assignment profile</label>
              <Tooltip text="Indicates how comfortable it is to own the stock if a put option is assigned, based on fundamentals and balance-sheet strength." />
            </div>

            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="opt in assignmentOptions"
                :key="opt"
                @click="toggleAssignment(opt)"
                class="rounded-xl px-3 py-2 text-xs ring-1 transition"
                :class="local.assignmentProfile.has(opt)
                  ? 'bg-slate-800 text-slate-100 ring-slate-700'
                  : 'bg-slate-950/40 text-slate-300 ring-slate-800 hover:bg-slate-900/60'"
              >
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- DTE -->
          <div>
            <label class="text-sm font-medium">Days to exp.</label>
            <div class="mt-2 flex gap-2">
              <input
                v-model.number="local.dteMin"
                type="number"
                min="0"
                class="w-1/2 rounded-xl bg-slate-950/40 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-slate-600"
                placeholder="Min"
              />
              <input
                v-model.number="local.dteMax"
                type="number"
                min="0"
                class="w-1/2 rounded-xl bg-slate-950/40 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-slate-600"
                placeholder="Max"
              />
            </div>
          </div>

          <!-- Delta -->
          <div>
            <label class="text-sm font-medium">Delta range</label>
            <div class="mt-2 flex gap-2">
              <input
                v-model.number="local.deltaMin"
                type="number"
                step="0.01"
                class="w-1/2 rounded-xl bg-slate-950/40 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-slate-600"
                placeholder="-0.45"
              />
              <input
                v-model.number="local.deltaMax"
                type="number"
                step="0.01"
                class="w-1/2 rounded-xl bg-slate-950/40 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-slate-600"
                placeholder="-0.15"
              />
            </div>
          </div>

          <!-- Min monthly return -->
          <div>
            <label class="text-sm font-medium">Min monthly return (%)</label>
            <div class="mt-2">
              <input
                v-model.number="local.minMonthlyReturnPct"
                type="number"
                step="0.1"
                min="0"
                class="w-full rounded-xl bg-slate-950/40 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-slate-600"
                placeholder="1.5"
              />
            </div>
          </div>
        </div>

        <div class="mt-2 lg:mt-0 flex justify-end">
          <button
            class="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700"
            @click="() => {}"
            title="Filters are applied instantly in this demo"
          >
            Applied
          </button>
        </div>
      </div>
    </div>
  `,
});

/** ---------- OpportunitiesTable ---------- */
const OpportunitiesTable = defineComponent({
  name: "OpportunitiesTable",
  components: { Tooltip },
  props: {
    rows: { type: Array as any, required: true },
  },
  emits: ["select"],
  setup(_props, { emit }) {
    function uiProfileFromClassification(c: ClassificationBackend): AssignmentUI {
      if (c === "Wheel-Ready") return "Favorable assignment";
      if (c === "Watchlist") return "Selective assignment";
      return "Unfavorable assignment";
    }

    function pillClass(profile: AssignmentUI) {
      if (profile === "Favorable assignment") {
        return "bg-emerald-500/10 text-emerald-200 ring-emerald-500/20";
      }
      if (profile === "Selective assignment") {
        return "bg-amber-500/10 text-amber-200 ring-amber-500/20";
      }
      return "bg-rose-500/10 text-rose-200 ring-rose-500/20";
    }

    function fmtMoney(n: number) {
      return `$${n.toFixed(2)}`;
    }

    return { uiProfileFromClassification, pillClass, fmtMoney, emit };
  },
  template: `
    <div class="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-semibold">Results</h2>
          <span class="text-xs text-slate-400">{{ rows.length }} matches</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="bg-slate-900">
            <tr class="text-xs text-slate-300">
              <th class="px-4 py-3 font-medium">Ticker</th>
              <th class="px-4 py-3 font-medium">
                <div class="inline-flex items-center gap-2">
                  Assignment profile
                  <Tooltip text="Indicates how comfortable it is to own the stock if a put option is assigned, based on fundamentals and balance-sheet strength." />
                </div>
              </th>
              <th class="px-4 py-3 font-medium">Price</th>
              <th class="px-4 py-3 font-medium">Put strike</th>
              <th class="px-4 py-3 font-medium">Days to exp.</th>
              <th class="px-4 py-3 font-medium">Delta</th>
              <th class="px-4 py-3 font-medium">Premium</th>
              <th class="px-4 py-3 font-medium">Est. monthly return</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="r in rows"
              :key="r.ticker + '-' + r.strike + '-' + r.dte"
              class="border-t border-slate-800 hover:bg-slate-800/30 cursor-pointer"
              @click="emit('select', r)"
            >
              <td class="px-4 py-3">
                <div class="font-semibold text-slate-100">{{ r.ticker }}</div>
                <div class="text-xs text-slate-400">{{ r.company }}</div>
              </td>

              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1"
                  :class="pillClass(uiProfileFromClassification(r.report.classification))"
                >
                  {{ uiProfileFromClassification(r.report.classification) }}
                  <span class="text-slate-200/90">·</span>
                  <span class="font-semibold">{{ r.report.great_company_score }}</span>
                </span>
              </td>

              <td class="px-4 py-3 text-sm text-slate-200">{{ fmtMoney(r.price) }}</td>
              <td class="px-4 py-3 text-sm text-slate-200">{{ r.strike }}</td>
              <td class="px-4 py-3 text-sm text-slate-200">{{ r.dte }}</td>
              <td class="px-4 py-3 text-sm text-slate-200">{{ r.delta.toFixed(2) }}</td>
              <td class="px-4 py-3 text-sm text-slate-200">{{ fmtMoney(r.premium) }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-slate-100">
                {{ r.monthlyReturnPct.toFixed(1) }}%
              </td>
            </tr>

            <tr v-if="rows.length === 0">
              <td colspan="8" class="px-4 py-10 text-center">
                <div class="text-sm font-semibold">No suitable opportunities found</div>
                <div class="mt-1 text-sm text-slate-400">
                  Try loosening delta, expiration, or assignment profile filters.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
});

/** ---------- StockDrawer ---------- */
const StockDrawer = defineComponent({
  name: "StockDrawer",
  props: {
    open: { type: Boolean, required: true },
    row: { type: Object as any, default: null },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const uiProfile = computed<AssignmentUI | null>(() => {
      if (!props.row) return null;
      const c: ClassificationBackend = props.row.report.classification;
      if (c === "Wheel-Ready") return "Favorable assignment";
      if (c === "Watchlist") return "Selective assignment";
      return "Unfavorable assignment";
    });

    const headerPillClass = computed(() => {
      if (uiProfile.value === "Favorable assignment") {
        return "bg-emerald-500/10 text-emerald-200 ring-emerald-500/20";
      }
      if (uiProfile.value === "Selective assignment") {
        return "bg-amber-500/10 text-amber-200 ring-amber-500/20";
      }
      return "bg-rose-500/10 text-rose-200 ring-rose-500/20";
    });

    function oneLineExplainer(profile: AssignmentUI | null) {
      if (profile === "Favorable assignment") {
        return "Strong fundamentals and balance sheet make owning the stock an acceptable outcome if assigned.";
      }
      if (profile === "Selective assignment") {
        return "Suitable for put selling, but requires conservative strike selection or timing due to cyclical risk factors.";
      }
      if (profile === "Unfavorable assignment") {
        return "Fundamental or balance-sheet risks make owning the stock undesirable if a put is assigned.";
      }
      return "";
    }

    function cashFlowLine(r: AgentReport) {
      const map: Record<string, string> = {
        stable: "stable",
        volatile_but_resilient: "volatile but resilient",
        deteriorating: "deteriorating",
      };
      return `Cash flow: ${map[r.cash_flow.fcf_trend]}`;
    }

    function balanceSheetLine(r: AgentReport) {
      const lev = r.balance_sheet.leverage_level.replace("_", " ");
      const liq = r.balance_sheet.liquidity.replace("_", " ");
      return `Balance sheet: ${lev} leverage, ${liq} liquidity`;
    }

    function profitabilityLine(r: AgentReport) {
      const ec =
        r.profitability.earnings_consistency === "cyclical_positive"
          ? "cyclical but positive"
          : r.profitability.earnings_consistency;
      const mp = r.profitability.margin_profile;
      return `Profitability: ${ec} earnings, ${mp} margins`;
    }

    function deltaRangeLabel(r: AgentReport) {
      const [a, b] = r.put_selling_guidance.recommended_delta_range;
      return `${a.toFixed(2)} to ${b.toFixed(2)}`;
    }

    return {
      uiProfile,
      headerPillClass,
      oneLineExplainer,
      cashFlowLine,
      balanceSheetLine,
      profitabilityLine,
      deltaRangeLabel,
      emit,
    };
  },
  template: `
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="emit('close')"></div>

        <!-- Panel -->
        <aside
          class="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-slate-950 ring-1 ring-slate-800 shadow-2xl"
        >
          <div class="flex h-full flex-col">
            <!-- Top bar -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div class="text-sm font-semibold text-slate-200">Details</div>
              <button
                class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60"
                @click="emit('close')"
              >
                Close
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-5 py-5" v-if="row">
              <!-- Header -->
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-xl font-semibold tracking-tight">
                    {{ row.ticker }}
                    <span class="text-slate-400 text-base font-medium">
                      — {{ row.company }}
                    </span>
                  </div>

                  <div class="mt-2">
                    <span
                      class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1"
                      :class="headerPillClass"
                    >
                      {{ uiProfile }} ·
                      <span class="font-semibold">{{ row.report.great_company_score }}</span>
                    </span>
                  </div>

                  <p class="mt-3 text-sm text-slate-300">
                    {{ oneLineExplainer(uiProfile) }}
                  </p>
                </div>
              </div>

              <!-- Summary -->
              <div class="mt-6 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
                <div class="text-sm font-semibold">Why this stock appears</div>
                <ul class="mt-3 space-y-2 text-sm text-slate-200">
                  <li>• {{ cashFlowLine(row.report) }}</li>
                  <li>• {{ balanceSheetLine(row.report) }}</li>
                  <li>• {{ profitabilityLine(row.report) }}</li>
                </ul>
              </div>

              <!-- Risk flags -->
              <div class="mt-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
                <div class="text-sm font-semibold">Key considerations</div>
                <div class="mt-3 flex flex-wrap gap-2" v-if="row.report.risk_flags?.length">
                  <span
                    v-for="f in row.report.risk_flags"
                    :key="f"
                    class="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 ring-1 ring-slate-700"
                  >
                    {{ f }}
                  </span>
                </div>
                <div v-else class="mt-2 text-sm text-slate-400">
                  No major red flags detected.
                </div>
              </div>

              <!-- Guidance -->
              <div class="mt-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold">Put-selling guidance</div>
                  <span
                    v-if="row.report.put_selling_guidance.earnings_caution"
                    class="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-200 ring-1 ring-amber-500/20"
                  >
                    Earnings caution
                  </span>
                </div>

                <div class="mt-4 space-y-3 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Suggested delta</span>
                    <span class="font-semibold text-slate-100">
                      {{ deltaRangeLabel(row.report) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Assignment comfort</span>
                    <span class="font-semibold text-slate-100">
                      {{ row.report.put_selling_guidance.assignment_tolerance }}
                    </span>
                  </div>
                </div>

                <div class="mt-3 text-xs text-slate-400">
                  Lower delta reduces the likelihood of assignment but also lowers premium.
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-5 flex gap-2">
                <button
                  class="flex-1 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold ring-1 ring-slate-700 hover:bg-slate-700"
                >
                  View options chain
                </button>
                <button
                  class="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-200 ring-1 ring-slate-800 hover:bg-slate-800/60"
                >
                  Add to watchlist
                </button>
              </div>

              <!-- Raw summary (optional) -->
              <div class="mt-6 text-xs text-slate-400">
                <div class="font-semibold text-slate-300">Model summary</div>
                <div class="mt-1">{{ row.report.summary }}</div>
              </div>
            </div>

            <div v-else class="grid flex-1 place-items-center text-slate-400">
              Select a row to view details.
            </div>
          </div>
        </aside>
      </div>
    </transition>
  `,
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
