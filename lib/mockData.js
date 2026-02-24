/**
 * KASPARRO MOCK DATA
 * Pure JS — no React, no "use client" needed.
 * Swap each export for a real API call/hook when backend is ready.
 */

export const BRAND = { name: "BrandX", domain: "brandx.com" };

export const mockAudits = [
  { run_id:"r1", audit_mode:"robust", status:"completed", progress_pct:100, queued_at:"2026-02-23T14:32:00Z", duration_seconds:1680, overall_score:74, grade:"B" },
  { run_id:"r2", audit_mode:"medium", status:"running",   progress_pct:62,  queued_at:"2026-02-23T17:50:00Z", duration_seconds:null, overall_score:null, grade:null },
  { run_id:"r3", audit_mode:"lite",   status:"failed",    progress_pct:0,   queued_at:"2026-02-21T10:10:00Z", duration_seconds:null, overall_score:null, grade:null },
  { run_id:"r4", audit_mode:"robust", status:"partial",   progress_pct:100, queued_at:"2026-02-20T09:00:00Z", duration_seconds:1820, overall_score:61,   grade:"C" },
  { run_id:"r5", audit_mode:"medium", status:"completed", progress_pct:100, queued_at:"2026-02-15T09:00:00Z", duration_seconds:620,  overall_score:68,   grade:"C" },
];

export const mockModules = [
  {
    module_name:"ai_search_visibility", display_name:"AI Search Visibility",
    final_score:82, confidence:0.91, coverage:0.95, status:"completed",
    north_star:{ label:"Branded mention rate", value:"78%", delta:"+17% vs median", positive:true },
    drivers:["Brand absent in category queries","Gemini underperforming","ChatGPT presence strong"],
    interpretation:"Brand appears consistently in branded AI queries but has near-zero presence in category-level discovery queries across all tested engines.",
    score_components:[
      { label:"Branded mention rate",     value:78, weight:"35%", benchmark:61 },
      { label:"First-mention rate",       value:91, weight:"25%", benchmark:44 },
      { label:"Category query presence",  value:12, weight:"25%", benchmark:38 },
      { label:"Multi-engine consistency", value:84, weight:"15%", benchmark:70 },
    ],
    evidence:[
      { type:"Queries tested", value:"47 branded · 83 category-level", rows:[
        { col1:"ChatGPT branded",     col2:"84%", col3:"above median" },
        { col1:"Perplexity branded",  col2:"71%", col3:"above median" },
        { col1:"Gemini branded",      col2:"54%", col3:"below median" },
        { col1:"Claude branded",      col2:"79%", col3:"above median" },
        { col1:"ChatGPT category",    col2:"18%", col3:"below median" },
        { col1:"Perplexity category", col2:"9%",  col3:"critical gap" },
      ]},
      { type:"Engines covered",      value:"ChatGPT, Perplexity, Gemini, Claude", rows:[] },
      { type:"Branded mention rate", value:"78% — above category median (61%)", rows:[] },
      { type:"Category mention rate",value:"12% — well below median (38%)", rows:[
        { col1:"Protein category",    col2:"14%", col3:"9 of 65 queries" },
        { col1:"Supplement category", col2:"8%",  col3:"5 of 62 queries" },
        { col1:"Wellness category",   col2:"17%", col3:"9 of 53 queries" },
      ]},
    ],
    findings:[
      { finding_id:"f1", priority:"P0", title:"Brand absent on category queries",       score_basis:"12% presence vs 38% category median",                      action:"Create AI-optimised category content for top 10 non-branded queries", impact_metric:"−26pts vs median", evidence_refs:[3] },
      { finding_id:"f2", priority:"P1", title:"Gemini significantly underperforming",   score_basis:"54% branded vs 82% average across other engines",            action:"Submit to Google Knowledge Panel, update Wikidata entry",             impact_metric:"−28pts vs peers", evidence_refs:[0] },
      { finding_id:"f3", priority:"P2", title:"Cross-engine consistency fragile",       score_basis:"ChatGPT 84% vs Perplexity 71% — 13pt spread",               action:"Audit content freshness across all crawlable entry points",           impact_metric:"13pt spread",     evidence_refs:[0] },
    ],
    patterns:{ type:"heatmap", title:"Mention rate by engine × query type",
      rows:["ChatGPT","Perplexity","Gemini","Claude"],
      cols:["Branded","Category","Ingredient","Comparison","Problem"],
      values:[[84,18,42,61,55],[71,9,38,55,49],[54,4,29,41,37],[79,14,35,58,51]] },
    actions:[
      "Publish 8–12 structured Q&A pages targeting branded query patterns",
      "Create category-level content for the top 10 non-branded discovery queries",
      "Submit brand entity data to Google Knowledge Panel",
      "Review and update Wikipedia/Wikidata brand entry",
      "Run monthly query monitoring across all 4 engines",
    ],
  },
  {
    module_name:"serp_entity_schema", display_name:"SERP Entity Schema",
    final_score:43, confidence:0.88, coverage:0.90, status:"completed",
    north_star:{ label:"Schema coverage rate", value:"25%", delta:"−66% vs median", positive:false },
    drivers:["6 PDPs missing Product schema","14 validation errors","BreadcrumbList 0%"],
    interpretation:"Critical schema coverage gaps. Only 2 of 8 PDPs have structured data. Competitors average 91% — largest quick-win opportunity.",
    score_components:[
      { label:"Schema coverage rate",     value:25, weight:"40%", benchmark:91 },
      { label:"Schema error rate",        value:38, weight:"30%", benchmark:8  },
      { label:"Schema type completeness", value:51, weight:"20%", benchmark:78 },
      { label:"Rich result eligibility",  value:60, weight:"10%", benchmark:85 },
    ],
    evidence:[
      { type:"PDPs with schema", value:"2 of 8 (25%) — competitor avg 91%", rows:[
        { col1:"/products/whey-protein", col2:"Product schema", col3:"2 errors"  },
        { col1:"/products/creatine",     col2:"Product schema", col3:"12 errors" },
        { col1:"/products/bcaa",         col2:"Missing",        col3:"—" },
        { col1:"/products/pre-workout",  col2:"Missing",        col3:"—" },
        { col1:"/products/collagen",     col2:"Missing",        col3:"—" },
      ]},
      { type:"Schema errors", value:"14 errors across 2 pages with schema", rows:[
        { col1:"Missing 'brand' property", col2:"Both pages",         col3:"Required"    },
        { col1:"Missing aggregateRating",  col2:"/products/whey",     col3:"Recommended" },
        { col1:"Invalid 'price' format",   col2:"/products/creatine", col3:"Required"    },
      ]},
    ],
    findings:[
      { finding_id:"f4", priority:"P0", title:"Product schema missing on 6 of 8 PDPs",    score_basis:"25% vs 91% competitor average",                         action:"Add Product schema via Shopify JSON-LD injection",            impact_metric:"6 pages blocked", evidence_refs:[0] },
      { finding_id:"f5", priority:"P0", title:"14 validation errors on existing pages",   score_basis:"Both pages have critical errors blocking rich results",   action:"Fix required property errors before expanding coverage",       impact_metric:"14 errors",       evidence_refs:[1] },
      { finding_id:"f6", priority:"P1", title:"BreadcrumbList schema absent site-wide",   score_basis:"0% vs 78% competitor average",                           action:"Add BreadcrumbList to all category and product pages",         impact_metric:"0% vs 78%",       evidence_refs:[0] },
    ],
    patterns:{ type:"heatmap", title:"Schema coverage by page type × schema type",
      rows:["PDPs","Category","Blog","Homepage","FAQ"],
      cols:["Product","Review","Breadcrumb","FAQ","Organization"],
      values:[[25,0,0,0,0],[0,0,61,0,0],[0,0,81,0,0],[0,0,0,0,100],[0,0,0,0,0]] },
    actions:[
      "Fix 14 schema errors on existing 2 PDPs — unblock rich results immediately",
      "Add Product schema to all 8 PDPs using Shopify JSON-LD injection",
      "Add Review schema after Product schema is stable",
      "Add BreadcrumbList across category hierarchy",
      "Validate with Google Rich Results Test before publishing",
    ],
  },
  {
    module_name:"non_branded_keywords", display_name:"Non-Branded Keywords",
    final_score:78, confidence:0.85, coverage:0.88, status:"completed",
    north_star:{ label:"First-page presence", value:"68%", delta:"+13% vs median", positive:true },
    drivers:["14 high-volume zero-presence terms","Featured snippets under pressure","Long-tail coverage strong"],
    interpretation:"Solid foundation but 14 high-value category terms have zero first-page presence.",
    score_components:[
      { label:"Category keyword coverage", value:71, weight:"35%", benchmark:65 },
      { label:"First-page presence rate",  value:68, weight:"30%", benchmark:55 },
      { label:"Featured snippet capture",  value:82, weight:"20%", benchmark:41 },
      { label:"Long-tail coverage",        value:91, weight:"15%", benchmark:72 },
    ],
    evidence:[
      { type:"Keywords tracked", value:"247 category-level keywords", rows:[
        { col1:"First-page (pos 1-10)", col2:"168", col3:"68%" },
        { col1:"Page 2 (pos 11-20)",    col2:"48",  col3:"19%" },
        { col1:"Not ranking",           col2:"31",  col3:"13%" },
      ]},
      { type:"Zero-presence keywords", value:"14 high-volume terms, avg 8,400/mo", rows:[
        { col1:"best protein powder women", col2:"22,000/mo", col3:"no ranking" },
        { col1:"clean protein powder",      col2:"14,000/mo", col3:"no ranking" },
        { col1:"high protein supplement",   col2:"9,000/mo",  col3:"no ranking" },
      ]},
    ],
    findings:[
      { finding_id:"f7", priority:"P1", title:"14 high-volume keywords with zero presence", score_basis:"14 terms averaging 8,400 monthly searches", action:"Create landing pages for 5 highest-volume gap keywords",           impact_metric:"117K mo. searches", evidence_refs:[1] },
      { finding_id:"f8", priority:"P2", title:"Featured snippets not defended",             score_basis:"8 snippets within 2 positions of displacement", action:"Strengthen schema and content depth on snippet pages",            impact_metric:"8 at risk",         evidence_refs:[0] },
    ],
    patterns:{ type:"heatmap", title:"Keyword rank distribution by cluster",
      rows:["Protein","Supplement","Wellness","Recovery","Weight"],
      cols:["P1–3","P4–10","P11–20","Not ranking"],
      values:[[45,28,12,15],[38,31,18,13],[29,34,22,15],[51,27,14,8],[22,29,31,18]] },
    actions:[
      "Create 5 landing pages for highest-volume gap keywords",
      "Strengthen featured snippet pages against competitive displacement",
      "Expand long-tail content cluster around top-performing seed terms",
      "Audit internal linking for underperforming category pages",
    ],
  },
  {
    module_name:"perception_graph", display_name:"Perception Graph",
    final_score:71, confidence:0.79, coverage:0.82, status:"completed",
    north_star:{ label:"Sentiment positivity rate", value:"84%", delta:"+13% vs median", positive:true },
    drivers:["Efficacy attributes weak vs competitors","Attribute breadth narrow","Premium positioning strong"],
    interpretation:"Broadly positive but concentrated in narrow attribute set. Functional efficacy attributes weak vs competitors.",
    score_components:[
      { label:"Attribute breadth",                 value:58, weight:"30%", benchmark:72 },
      { label:"Sentiment consistency",             value:84, weight:"30%", benchmark:71 },
      { label:"Competitive attribute positioning", value:61, weight:"25%", benchmark:68 },
      { label:"AI perception alignment",           value:79, weight:"15%", benchmark:63 },
    ],
    evidence:[
      { type:"Sources analysed", value:"1,240 review signals across 8 platforms", rows:[
        { col1:"Amazon",     col2:"487 reviews", col3:"4.5 avg" },
        { col1:"Shopify",    col2:"312 reviews", col3:"4.8 avg" },
        { col1:"Trustpilot", col2:"198 reviews", col3:"4.2 avg" },
        { col1:"Reddit",     col2:"143 mentions",col3:"mixed"   },
      ]},
      { type:"Weak attributes", value:"Efficacy 34%, Science-backed 28%", rows:[
        { col1:"Efficacy",       col2:"34%", col3:"competitor: 72%" },
        { col1:"Science-backed", col2:"28%", col3:"competitor: 65%" },
      ]},
    ],
    findings:[
      { finding_id:"f9",  priority:"P1", title:"Efficacy attributes underrepresented",      score_basis:"34% efficacy mentions vs competitor 72%",              action:"Add clinical evidence to PDPs and blog",                                   impact_metric:"−38pts vs comp.", evidence_refs:[1] },
      { finding_id:"f10", priority:"P2", title:"Perception concentrated in 3 attributes",  score_basis:"Quality/Taste/Clean dominate 90% of signals",          action:"Expand content targeting underrepresented benefit attributes",              impact_metric:"3 of 12 attrs",  evidence_refs:[0] },
    ],
    patterns:{ type:"heatmap", title:"Attribute mention rate by platform",
      rows:["Amazon","Shopify","Trustpilot","Reddit","YouTube"],
      cols:["Quality","Taste","Clean","Efficacy","Value","Science"],
      values:[[91,88,85,38,72,31],[95,91,89,42,68,29],[87,82,79,31,71,24],[74,61,71,44,55,38],[89,84,82,28,63,19]] },
    actions:[
      "Commission or surface existing clinical evidence for core claims",
      "Create Science & Research content hub with supporting studies",
      "Rewrite PDP benefit sections to foreground measurable efficacy claims",
      "Add before/after testimonial content with specific results data",
    ],
  },
  {
    module_name:"backlink_trust_vector", display_name:"Backlink Trust Vector",
    final_score:58, confidence:0.82, coverage:0.86, status:"completed",
    north_star:{ label:"Domain rating", value:"DR 28", delta:"−26 vs median DR 54", positive:false },
    drivers:["Domain authority 26pts below median","Editorial link ratio critically low","Link velocity 4x below category"],
    interpretation:"Backlink profile below category median on all authority metrics. DR gap suppresses AI trust signal scoring.",
    score_components:[
      { label:"Domain authority",         value:51, weight:"35%", benchmark:71 },
      { label:"Referring domain quality", value:62, weight:"30%", benchmark:74 },
      { label:"Anchor text diversity",    value:71, weight:"20%", benchmark:68 },
      { label:"Link velocity (90d)",      value:44, weight:"15%", benchmark:58 },
    ],
    evidence:[
      { type:"Domain rating", value:"DR 28 vs competitor median DR 54", rows:[
        { col1:"BrandX",       col2:"DR 28", col3:"target"       },
        { col1:"Competitor A", col2:"DR 61", col3:"leader"       },
        { col1:"Competitor B", col2:"DR 54", col3:"median"       },
        { col1:"Competitor C", col2:"DR 47", col3:"below median" },
      ]},
      { type:"Editorial link ratio", value:"22% editorial vs 61% competitor avg", rows:[
        { col1:"Editorial",    col2:"68 links",  col3:"22%" },
        { col1:"Directory",    col2:"124 links", col3:"40%" },
        { col1:"Forum/social", col2:"120 links", col3:"38%" },
      ]},
    ],
    findings:[
      { finding_id:"f11", priority:"P1", title:"Domain authority 26pts below median",      score_basis:"DR 28 vs median DR 54",                               action:"Initiate link-building targeting category review publications", impact_metric:"−26 DR pts",  evidence_refs:[0] },
      { finding_id:"f12", priority:"P1", title:"Editorial link ratio critically low",      score_basis:"22% editorial vs 61% competitor average",             action:"Prioritise earned media over directory submissions",           impact_metric:"22% vs 61%", evidence_refs:[1] },
      { finding_id:"f13", priority:"P2", title:"Link velocity 4x below category average", score_basis:"8 new domains per 90d vs avg 34",                     action:"Set monthly acquisition target: 12+ referring domains",        impact_metric:"8 vs 34/qtr",evidence_refs:[0] },
    ],
    patterns:{ type:"heatmap", title:"Link quality by source type x DR band",
      rows:["Editorial","Directory","Forum","Social","Partner"],
      cols:["DR<20","DR 20-40","DR 40-60","DR 60-80","DR 80+"],
      values:[[4,12,18,24,10],[38,56,22,8,0],[44,48,18,8,2],[61,34,18,6,1],[2,8,14,19,8]] },
    actions:[
      "Target top 20 category editorial publications for outreach",
      "Create linkable assets: original research, category reports",
      "Submit to 5 high-authority industry directories (DR>60 only)",
      "Identify and recover broken backlinks from referring domains",
      "90-day target: 35 new referring domains, minimum DR 40",
    ],
  },
  {
    module_name:"eeat_analysis", display_name:"E-E-A-T Analysis",
    final_score:66, confidence:0.77, coverage:0.80, status:"completed",
    north_star:{ label:"Author expertise coverage", value:"0%", delta:"−72% vs median", positive:false },
    drivers:["0 of 12 blog posts have credentials","About page lacks trust signals","3rd-party citations minimal"],
    interpretation:"E-E-A-T signals present but inconsistently applied. Author credentials absent on all content.",
    score_components:[
      { label:"Author expertise signals",     value:41, weight:"30%", benchmark:72 },
      { label:"Site trustworthiness signals", value:74, weight:"25%", benchmark:78 },
      { label:"Content experience signals",   value:71, weight:"25%", benchmark:69 },
      { label:"Authority citation signals",   value:58, weight:"20%", benchmark:65 },
    ],
    evidence:[
      { type:"Blog posts with author bio", value:"0 of 12 posts", rows:[
        { col1:"/blog/protein-101",      col2:"No author", col3:"fix needed" },
        { col1:"/blog/supplement-guide", col2:"No author", col3:"fix needed" },
        { col1:"/blog/clean-eating",     col2:"No author", col3:"fix needed" },
      ]},
      { type:"Third-party citations", value:"3 from authority sources in 12 months", rows:[
        { col1:"Healthline",    col2:"1 citation", col3:"product mention"      },
        { col1:"Womens Health", col2:"1 citation", col3:"roundup inclusion"    },
        { col1:"Examine.com",   col2:"1 citation", col3:"ingredient reference" },
      ]},
    ],
    findings:[
      { finding_id:"f14", priority:"P2", title:"Author credentials absent across all blog content", score_basis:"0 of 12 posts have author bio with credentials",        action:"Add author schema and credential bios to all content",          impact_metric:"12 pages",      evidence_refs:[0] },
      { finding_id:"f15", priority:"P2", title:"About page lacks structured trust evidence",        score_basis:"No certifications, credentials, or third-party validation", action:"Rebuild About/Team pages with structured credentials",           impact_metric:"0 trust signals",evidence_refs:[1] },
    ],
    patterns:{ type:"heatmap", title:"E-E-A-T signal presence by content type",
      rows:["Blog posts","PDPs","About/Team","FAQ","Homepage"],
      cols:["Author bio","Schema","Citations","Reviews","Certs"],
      values:[[0,0,25,0,0],[0,25,0,100,0],[0,0,33,0,0],[0,0,0,0,0],[0,0,0,0,0]] },
    actions:[
      "Add structured author bios with credentials to all 12 blog posts",
      "Add Person schema to all content authors",
      "Rebuild About page with team credentials, certifications, press coverage",
      "Apply for third-party certifications (NSF, Informed Sport)",
    ],
  },
  {
    module_name:"ai_sentiment", display_name:"AI Sentiment",
    final_score:89, confidence:0.93, coverage:0.97, status:"completed",
    north_star:{ label:"Positive sentiment rate", value:"87%", delta:"+25% vs median", positive:true },
    drivers:["Premium positioning excellent","Negative mention rate minimal","Price-value queries mixed"],
    interpretation:"Strongest module. AI engines consistently describe BrandX positively. Only gap is mixed sentiment on price-value queries.",
    score_components:[
      { label:"Overall sentiment score",     value:92, weight:"35%", benchmark:67 },
      { label:"Sentiment consistency",       value:88, weight:"25%", benchmark:61 },
      { label:"Premium attribute alignment", value:91, weight:"25%", benchmark:58 },
      { label:"Negative mention rate",       value:85, weight:"15%", benchmark:71 },
    ],
    evidence:[
      { type:"Sentiment by engine", value:"94 queries across 4 engines", rows:[
        { col1:"ChatGPT",    col2:"91% positive", col3:"3% negative" },
        { col1:"Perplexity", col2:"88% positive", col3:"4% negative" },
        { col1:"Gemini",     col2:"84% positive", col3:"6% negative" },
        { col1:"Claude",     col2:"89% positive", col3:"4% negative" },
      ]},
      { type:"Mixed sentiment area", value:"Price-value queries — 34% neutral/mixed", rows:[
        { col1:"is BrandX worth it",    col2:"41% mixed", col3:"price perception" },
        { col1:"BrandX vs competitors", col2:"29% mixed", col3:"value comparison" },
        { col1:"is BrandX expensive",   col2:"34% mixed", col3:"price anchor"     },
      ]},
    ],
    findings:[
      { finding_id:"f16", priority:"P2", title:"Price-value perception mixed on cost queries", score_basis:"34% neutral/mixed on price-value queries", action:"Create value-framing content: cost-per-serving, long-term ROI", impact_metric:"34% neutral", evidence_refs:[1] },
    ],
    patterns:{ type:"heatmap", title:"Sentiment by engine x query type",
      rows:["ChatGPT","Perplexity","Gemini","Claude"],
      cols:["Brand identity","Quality","Efficacy","Value","Comparison"],
      values:[[94,91,88,61,78],[91,88,84,58,74],[88,85,79,52,69],[92,89,86,59,76]] },
    actions:[
      "Create value-framing content: cost-per-serving comparison, results data",
      "Ensure positive review content is easily crawlable and structured",
      "Monitor sentiment quarterly — protect this strength",
    ],
  },
];

export const mockProgressModules = [
  { module_name:"ai_search_visibility",  display_name:"AI Search Visibility",  status:"completed",   final_score:82   },
  { module_name:"serp_entity_schema",    display_name:"SERP Entity Schema",     status:"completed",   final_score:43   },
  { module_name:"non_branded_keywords",  display_name:"Non-Branded Keywords",   status:"in_progress", final_score:null },
  { module_name:"perception_graph",      display_name:"Perception Graph",       status:"pending",     final_score:null },
  { module_name:"backlink_trust_vector", display_name:"Backlink Trust Vector",  status:"pending",     final_score:null },
  { module_name:"eeat_analysis",         display_name:"E-E-A-T Analysis",       status:"pending",     final_score:null },
  { module_name:"ai_sentiment",          display_name:"AI Sentiment",           status:"pending",     final_score:null },
];
