/**
 * Short English glosses for the 13 Indonesian method-family labels used
 * throughout the manifest. The Indonesian labels are preserved as the
 * primary taxonomy (they are the classification system as published on the
 * account); the gloss exists only to orient an international audience.
 */
export const methodGloss: Record<string, string> = {
  "Deret waktu & peramalan": "Time series & forecasting",
  "Keuangan, biaya & risiko": "Finance, cost & risk",
  "Kualitatif, literatur & penulisan": "Qualitative research, literature & writing",
  "Machine learning, AI & data mining": "Machine learning, AI & data mining",
  "MCDM, optimasi & riset operasi": "Multi-criteria decision making, optimization & operations research",
  "Meta-analisis & sintesis bukti": "Meta-analysis & evidence synthesis",
  "Pemodelan matematis, numerik & kendali": "Mathematical modelling, numerical methods & control",
  "Regresi, korelasi & ekonometrika": "Regression, correlation & econometrics",
  "SEM, pengukuran & psikometri": "Structural equation modelling, measurement & psychometrics",
  "Spasial, geografis & GIS": "Spatial, geographic & GIS analysis",
  "Statistik deskriptif & pengolahan data": "Descriptive statistics & data processing",
  "Uji hipotesis & rancangan eksperimen": "Hypothesis testing & experimental design",
  "Visualisasi, dashboard & presentasi": "Visualization, dashboards & presentation",
};

export function glossOf(method: string): string {
  return methodGloss[method] ?? method;
}
