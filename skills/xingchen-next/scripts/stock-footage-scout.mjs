#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_GLOBAL_ROOT = "C:\\Users\\liuzh\\Videos\\douyin\\visual-assets";
const DEFAULT_PROVIDERS = ["pexels", "pixabay", "coverr"];
const DEFAULT_NEGATIVE_PROMPT =
  "readable claim text, Chinese text, English text, proof, evidence, UI, chart, numbers, subtitles, captions, watermark, logo, face, identity-sensitive person, fake interface";

function parseArgs(argv) {
  const args = {
    state: path.resolve(process.cwd(), "project-state.json"),
    projectRoot: "",
    output: "",
    mdOutput: "",
    imagegenOutput: "",
    imagegenMdOutput: "",
    veoOutput: "",
    veoMdOutput: "",
    providers: DEFAULT_PROVIDERS,
    maxPerScene: 8,
    minDuration: 4,
    globalRoot: DEFAULT_GLOBAL_ROOT,
    download: "none",
    search: true,
    writeState: false,
    executeVeo: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i];
    if (!raw.startsWith("--")) continue;
    const [flag, inlineValue] = raw.split("=", 2);
    const nextValue = () => {
      if (inlineValue !== undefined) return inlineValue;
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${flag}`);
      return argv[i];
    };

    switch (flag) {
      case "--state":
        args.state = path.resolve(nextValue());
        break;
      case "--project-root":
        args.projectRoot = path.resolve(nextValue());
        break;
      case "--output":
        args.output = path.resolve(nextValue());
        break;
      case "--md-output":
        args.mdOutput = path.resolve(nextValue());
        break;
      case "--imagegen-output":
        args.imagegenOutput = path.resolve(nextValue());
        break;
      case "--imagegen-md-output":
        args.imagegenMdOutput = path.resolve(nextValue());
        break;
      case "--veo-output":
        args.veoOutput = path.resolve(nextValue());
        break;
      case "--veo-md-output":
        args.veoMdOutput = path.resolve(nextValue());
        break;
      case "--providers":
        args.providers = nextValue()
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);
        break;
      case "--max-per-scene":
        args.maxPerScene = Number.parseInt(nextValue(), 10);
        break;
      case "--min-duration":
        args.minDuration = Number.parseInt(nextValue(), 10);
        break;
      case "--global-root":
        args.globalRoot = path.resolve(nextValue());
        break;
      case "--download":
        args.download = nextValue();
        break;
      case "--write-state":
        args.writeState = true;
        break;
      case "--no-search":
      case "--dry-run":
        args.search = false;
        args.download = "none";
        break;
      case "--execute-veo":
        args.executeVeo = true;
        break;
      case "--help":
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${flag}`);
    }
  }

  if (!args.projectRoot) args.projectRoot = path.dirname(args.state);
  if (!args.output) args.output = path.join(args.projectRoot, "stock-footage-scout.json");
  if (!args.mdOutput) args.mdOutput = path.join(args.projectRoot, "stock-footage-scout.md");
  if (!args.imagegenOutput) args.imagegenOutput = path.join(args.projectRoot, "imagegen-prompt-pack.json");
  if (!args.imagegenMdOutput) args.imagegenMdOutput = path.join(args.projectRoot, "imagegen-prompt-pack.md");
  if (!args.veoOutput) args.veoOutput = path.join(args.projectRoot, "veo-video-request.json");
  if (!args.veoMdOutput) args.veoMdOutput = path.join(args.projectRoot, "veo-video-request.md");

  if (!Number.isFinite(args.maxPerScene) || args.maxPerScene < 1) {
    throw new Error("--max-per-scene must be a positive integer");
  }
  if (!Number.isFinite(args.minDuration) || args.minDuration < 1) {
    throw new Error("--min-duration must be a positive integer");
  }
  if (!["none", "selected"].includes(args.download)) {
    throw new Error('--download must be "none" or "selected"');
  }
  if (args.executeVeo) {
    throw new Error("--execute-veo is reserved for a future API executor; v1 only writes Veo request packs");
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
node scripts/stock-footage-scout.mjs --state path/to/project-state.json [options]

Options:
  --project-root PATH          Project output root. Defaults to state file directory.
  --output PATH                Unified scout JSON output. Defaults to stock-footage-scout.json.
  --md-output PATH             Human-readable scout markdown output.
  --providers LIST             pexels,pixabay,coverr by default.
  --max-per-scene N            Candidate limit per scene and provider.
  --min-duration N             Minimum stock clip duration in seconds.
  --global-root PATH           Xingchen visual asset library root.
  --download none|selected     Download only candidates already marked decision=selected.
  --write-state                Write resource_preflight and Veo prompt requests back to project-state.json.
  --dry-run / --no-search      Generate route/request packs without provider calls.
`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values) {
  return [...new Set(values.filter(hasText).map((item) => item.trim()))];
}

function nowIso() {
  return new Date().toISOString();
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function shortHash(value) {
  return sha256(value).slice(0, 12);
}

function normalizeId(value) {
  return String(value || "scene")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "scene";
}

function collectText(value, depth = 0) {
  if (depth > 4 || value === null || value === undefined) return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  if (Array.isArray(value)) return value.flatMap((item) => collectText(item, depth + 1));
  if (typeof value === "object") return Object.values(value).flatMap((item) => collectText(item, depth + 1));
  return [];
}

function sceneSearchText(scene) {
  return [
    scene.scene_job,
    scene.intent,
    scene.proof_need,
    scene.dominant_anchor,
    ...collectText(scene.board),
    ...collectText(scene.spec),
  ].join(" ");
}

function includesAny(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function loadGlobalAssetRegistry(args, scenes) {
  const registryPath = path.join(args.globalRoot, "registry", "asset-registry.json");
  const result = {
    checked: false,
    registry_path: registryPath,
    registry_missing: false,
    candidate_ids: [],
    matches: [],
    error: "",
  };

  if (!fs.existsSync(registryPath)) {
    result.checked = true;
    result.registry_missing = true;
    return result;
  }

  try {
    const registry = readJson(registryPath);
    const assets = asArray(registry.assets);
    result.checked = true;
    for (const scene of scenes) {
      const terms = queryTermsFromText(sceneSearchText(scene))
        .flatMap((query) => query.split(/\s+/))
        .map((term) => term.toLowerCase())
        .filter((term) => term.length >= 4);
      for (const asset of assets) {
        const haystack = [
          asset.asset_id,
          asset.title,
          asset.source_name,
          asset.asset_type,
          ...asArray(asset.tags),
          ...asArray(asset.visual_roles),
          ...asArray(asset.best_for),
        ]
          .join(" ")
          .toLowerCase();
        const hitCount = terms.filter((term) => haystack.includes(term)).length;
        if (hitCount === 0) continue;
        result.matches.push({
          scene_id: scene.scene_id,
          asset_id: asset.asset_id,
          asset_type: asset.asset_type,
          title: asset.title,
          local_path: asset.local_path,
          source_url: asset.source_url,
          match_score: hitCount,
          reason: "Matched scene route terms against global asset registry tags, roles, title, or best_for notes.",
        });
        result.candidate_ids.push(asset.asset_id);
      }
    }
    result.candidate_ids = unique(result.candidate_ids);
  } catch (error) {
    result.checked = false;
    result.error = error.message;
  }

  return result;
}

function getAspect(state) {
  const fromPolicy = state.visual?.visual_policy?.short_form_policy?.aspect_ratio;
  const fromVariant = asArray(state.variants).find((variant) => hasText(variant?.aspect))?.aspect;
  const aspect = fromVariant || fromPolicy || "9:16";
  if (String(aspect).includes("16:9")) return "16:9";
  if (String(aspect).includes("1:1")) return "1:1";
  return "9:16";
}

function orientationForProvider(aspect) {
  if (aspect === "16:9") return "landscape";
  if (aspect === "1:1") return "square";
  return "portrait";
}

function extractScenes(state) {
  const cards = asArray(state.mother?.story_mother?.scene_cards);
  const boardByScene = new Map(asArray(state.visual?.director_board?.scene_boards).map((board) => [board?.scene_id, board]));
  const specByScene = new Map(asArray(state.render?.scene_motion_specs).map((spec) => [spec?.scene_id, spec]));
  const order = asArray(state.mother?.story_mother?.scene_order).filter(hasText);
  const ids = unique([
    ...order,
    ...cards.map((card) => card?.scene_id),
    ...asArray(state.script?.beat_map?.scenes).map((scene) => scene?.scene_id),
    ...asArray(state.visual?.director_board?.scene_boards).map((board) => board?.scene_id),
  ]);

  return ids.map((sceneId) => {
    const card = cards.find((item) => item?.scene_id === sceneId) ?? {};
    const board = boardByScene.get(sceneId) ?? {};
    const spec = specByScene.get(sceneId) ?? {};
    return {
      scene_id: sceneId,
      scene_job: card.scene_job || board.scene_job || spec.render_mode || "",
      intent: card.intent || board.intent || spec.dominant_anchor || "",
      proof_need: card.proof_need || "",
      dominant_anchor: card.dominant_anchor || spec.dominant_anchor || board.dominant_anchor || "",
      card,
      board,
      spec,
    };
  });
}

const CODE_NATIVE_TERMS = [
  "proof",
  "evidence",
  "chart",
  "data",
  "table",
  "dashboard",
  "ui",
  "screenshot",
  "screen recording",
  "terminal",
  "workflow",
  "route",
  "node",
  "axis",
  "diagram",
  "process",
  "source",
  "证据",
  "证明",
  "数据",
  "图表",
  "表格",
  "界面",
  "截图",
  "录屏",
  "流程",
  "节点",
  "路线",
];

const IMAGEGEN_TERMS = [
  "hook",
  "shock",
  "metaphor",
  "physical",
  "object",
  "atmosphere",
  "background",
  "chapter",
  "opener",
  "payoff",
  "cinematic",
  "texture",
  "隐喻",
  "物体",
  "实物",
  "氛围",
  "背景",
  "开场",
  "章节",
  "质感",
  "冲击",
];

const STOCK_TERMS = [
  "city",
  "office",
  "desk",
  "hands",
  "device",
  "typing",
  "walking",
  "factory",
  "lab",
  "traffic",
  "nature",
  "window",
  "commute",
  "screen",
  "办公室",
  "城市",
  "桌面",
  "双手",
  "电脑",
  "手机",
  "工厂",
  "实验室",
  "交通",
  "自然",
  "屏幕",
];

const MOTION_TERMS = [
  "motion",
  "camera",
  "drift",
  "push",
  "material",
  "moving",
  "breathing",
  "flow",
  "particles",
  "light",
  "运动",
  "镜头",
  "推近",
  "漂移",
  "流动",
  "粒子",
  "光",
  "材质",
];

function classifyScene(scene) {
  const text = [
    scene.scene_job,
    scene.intent,
    scene.proof_need,
    scene.dominant_anchor,
    ...collectText(scene.board?.source_layer),
    ...collectText(scene.board?.frame_layer),
    ...collectText(scene.board?.component_layer),
    ...collectText(scene.board?.tech_stack_layer),
    ...collectText(scene.spec),
  ].join(" ");
  const primaryStack = String(scene.board?.tech_stack_layer?.primary_stack || "").toLowerCase();
  const evidenceRole = String(scene.board?.source_layer?.evidence_role || "").toLowerCase();
  const isGenInsert = primaryStack.includes("gen_insert") || scene.spec?.motion_source === "ai_video_generation";
  const isSourceMedia = primaryStack.includes("source") || scene.spec?.motion_source === "existing_media";
  const codeNative =
    !isGenInsert &&
    (isSourceMedia ||
      evidenceRole.includes("hero") ||
      includesAny(text, CODE_NATIVE_TERMS));
  const imagegenFit = isGenInsert || includesAny(text, IMAGEGEN_TERMS);
  const stockFit = includesAny(text, STOCK_TERMS);
  const motionFit = isGenInsert || includesAny(text, MOTION_TERMS);

  if (codeNative) {
    return {
      need_type: "code_native",
      final_default: "remotion_precision_layer",
      why: "Scene contains proof, UI, data, process, source media, or other audit-critical content that must stay code-native.",
      stock_search: false,
      imagegen_request: false,
      veo_request: false,
      motion_needed: false,
    };
  }

  if (imagegenFit && motionFit) {
    return {
      need_type: "veo_video_plate",
      final_default: "imagegen_plate_then_veo_video_plate",
      why: "Scene needs a material or atmospheric plate and short bounded motion, while Remotion keeps the precision layer.",
      stock_search: true,
      imagegen_request: true,
      veo_request: true,
      motion_needed: true,
    };
  }

  if (imagegenFit) {
    return {
      need_type: "imagegen_plate",
      final_default: "imagegen_plate_under_remotion",
      why: "Scene needs a static hero, metaphor, background, texture, or chapter plate if no usable real footage is found.",
      stock_search: true,
      imagegen_request: true,
      veo_request: false,
      motion_needed: false,
    };
  }

  return {
    need_type: stockFit ? "stock_footage" : "stock_footage_or_imagegen_fallback",
    final_default: "stock_video_plate_with_imagegen_fallback",
    why: "Scene can benefit from real commercially usable b-roll first; imagegen is only a fallback plate if stock is weak.",
    stock_search: true,
    imagegen_request: !stockFit,
    veo_request: !stockFit && motionFit,
    motion_needed: motionFit,
  };
}

const QUERY_DICTIONARY = [
  [/办公室|办公|工作|office/i, "office work close up"],
  [/城市|夜景|窗口|window|city/i, "city window night b roll"],
  [/桌|书桌|desk/i, "desk workspace cinematic close up"],
  [/电脑|键盘|屏幕|laptop|keyboard|screen/i, "laptop screen hands typing"],
  [/手机|device|phone/i, "smartphone hands close up"],
  [/实验室|lab/i, "laboratory technology b roll"],
  [/工厂|factory/i, "modern factory process b roll"],
  [/交通|通勤|traffic|commute/i, "urban commute traffic b roll"],
  [/自然|水|云|烟|nature|water|cloud|smoke/i, "abstract nature texture motion"],
  [/金钱|money|finance/i, "finance money exchange close up"],
  [/ai|人工智能|模型|model/i, "artificial intelligence abstract technology"],
  [/数据|图表|data|chart/i, "abstract data particles background"],
  [/手|hands/i, "human hands working close up"],
  [/灯|light|lamp/i, "warm desk lamp cinematic close up"],
];

function queryTermsFromText(text) {
  const mapped = QUERY_DICTIONARY.filter(([pattern]) => pattern.test(text)).map(([, query]) => query);
  const englishWords = text
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length >= 4 && !["scene", "proof", "with", "this", "that", "from"].includes(word));
  const phrase = englishWords.slice(0, 5).join(" ");
  return unique([...mapped, phrase && `${phrase} b roll`]);
}

function buildQueryPlan(scene, classification, aspect, minDuration) {
  const text = [
    scene.intent,
    scene.dominant_anchor,
    scene.proof_need,
    ...collectText(scene.board?.frame_layer),
    ...collectText(scene.board?.brainstorming_layer),
    ...collectText(scene.board?.component_layer),
  ].join(" ");
  const routeQueries = queryTermsFromText(text);
  const fallbackQueries =
    classification.need_type === "imagegen_plate" || classification.need_type === "veo_video_plate"
      ? ["cinematic abstract background", "warm workspace atmosphere", "material texture close up"]
      : ["office work close up", "abstract technology background", "city night b roll"];
  const queries = unique([...routeQueries, ...fallbackQueries]).slice(0, 8);
  return {
    scene_id: scene.scene_id,
    queries: classification.stock_search ? queries : [],
    negative_terms: ["text", "logo", "watermark", "subtitle", "news lower third", "brand endorsement"],
    desired_motion: classification.motion_needed
      ? "subtle physical motion or camera drift; no readable text or proof inside the plate"
      : "real-world ambience or texture usable behind Remotion overlays",
    desired_aspect: aspect,
    min_duration_sec: minDuration,
  };
}

function buildImagegenRequest(scene, classification, args) {
  if (!classification.imagegen_request) return null;
  const sceneId = normalizeId(scene.scene_id);
  return {
    request_id: `imagegen-${sceneId}-plate`,
    scene_id: scene.scene_id,
    status: "fallback_if_stock_rejected",
    visual_job: classification.need_type === "veo_video_plate" ? "source plate for bounded generated motion" : "fallback image plate",
    proof_role: "not_proof",
    prompt:
      `Create a clean cinematic image plate for scene "${scene.scene_id}". ` +
      `Visible job: ${scene.intent || scene.dominant_anchor || "support the narrated concept with a material visual"}. ` +
      "Leave calm negative space for Remotion overlays and subtitles. No text, no UI, no charts, no logos.",
    negative_prompt:
      "Chinese text, English text, readable words, subtitles, captions, logo, watermark, UI, chart, table, proof dashboard, fake screenshot, face, identity-sensitive person",
    safe_zones: {
      subtitle: "bottom 18 percent stays clean and low-detail",
      proof_overlay: "upper or center safe area remains low-contrast enough for Remotion labels",
    },
    overlay_plan: "Remotion owns all titles, Chinese captions, proof labels, arrows, and timing above this plate.",
    expected_output_paths: [
      path.join(args.projectRoot, "generated-assets", "imagegen", `${sceneId}-plate.png`),
    ],
    acceptance_criteria: [
      "plate supports the named scene intent",
      "no readable text, UI, logo, proof, chart, or subtitle appears in the image",
      "safe zones leave room for Remotion overlays",
      "image can be rejected without breaking the code-native fallback",
    ],
    state_trace_refs: [
      `mother.story_mother.scene_cards.${scene.scene_id}`,
      `visual.director_board.scene_boards.${scene.scene_id}`,
    ],
  };
}

function buildVeoRequest(scene, classification, args) {
  if (!classification.veo_request) return null;
  const sceneId = normalizeId(scene.scene_id);
  const requestId = `veo-${sceneId}-video-plate`;
  return {
    request_id: requestId,
    scene_ids: [scene.scene_id],
    option_type: "recommended",
    provider: "veo_video_generation",
    provider_model_hint: "configured_veo_model_id",
    technical_route: "image_to_video",
    prompt_pack_path: args.veoMdOutput,
    prompt_path: path.join(args.projectRoot, "veo-video-requests", `${sceneId}.md`),
    prompt_text:
      `Generate a short bounded motion plate for scene "${scene.scene_id}". ` +
      `Motion job: subtle camera drift, physical atmosphere, material/light movement, or concept-motion only. ` +
      `Scene intent: ${scene.intent || scene.dominant_anchor || "support the narration without carrying proof"}. ` +
      "Do not include any readable text, UI, chart, logo, face, or factual proof.",
    negative_prompt: DEFAULT_NEGATIVE_PROMPT,
    duration_sec: 4,
    aspect_ratio: getAspect({visual: {visual_policy: {short_form_policy: {aspect_ratio: "9:16"}}}}),
    reference_asset_paths: [
      path.join(args.projectRoot, "generated-assets", "imagegen", `${sceneId}-plate.png`),
    ],
    output_expectation: "One mp4/mov muted video plate, no baked subtitles, no readable text, suitable for Remotion video_plate integration.",
    status: "drafted",
    state_trace_refs: [
      `visual.director_board.scene_boards.${scene.scene_id}`,
      `render.scene_motion_specs.${scene.scene_id}`,
    ],
    proof_exclusion_policy:
      "No proof, no evidence, no readable claims, and no subtitles; Remotion owns proof overlays, captions, labels, timing, and final export.",
    remotion_integration_plan:
      "Use only as a muted Remotion video_plate behind programmatic subtitles, proof overlays, labels, and timing controls.",
    handoff_instructions:
      "User manually generates this on the configured Veo platform/model, downloads the mp4 or mov, returns or places it in the project, then Codex registers render.ai_video_candidates.",
    expected_candidate_id: `candidate-${requestId}`,
    notes: "Prompt-only Veo request pack; no API call is performed by this v1 scout.",
  };
}

function buildFallbackChain(scene, classification) {
  return {
    scene_id: scene.scene_id,
    ordered_routes: [
      {
        route: "global_asset_library",
        decision: "check_before_new_download_or_generation",
        reason: "Reusable Xingchen assets should be preferred before new provider calls.",
      },
      {
        route: "stock_footage",
        decision: classification.stock_search ? "search_first" : "skip_code_native_scene",
        reason: classification.stock_search
          ? "Commercially usable real footage is more credible than generation when it fits the visual job."
          : "Scene needs precision/proof/source rendering, not stock b-roll.",
      },
      {
        route: "imagegen_plate",
        decision: classification.imagegen_request ? "request_if_stock_rejected" : "not_allowed_for_precision_layer",
        reason: classification.imagegen_request
          ? "Imagegen may create a clean plate, atmosphere, or physical metaphor without carrying proof."
          : "Imagegen must not create proof, UI, labels, charts, or subtitles.",
      },
      {
        route: "veo_video_generation",
        decision: classification.veo_request ? "request_after_image_plate_if_motion_needed" : "not_needed",
        reason: classification.veo_request
          ? "Veo-style output is only a bounded Remotion video_plate for motion, not the final controller."
          : "No bounded generated video gap is present.",
      },
      {
        route: "remotion_precision_layer",
        decision: "always_required",
        reason: "Remotion owns captions, proof, labels, timing, and final composition.",
      },
    ],
    final_default: classification.final_default,
  };
}

async function searchPexels(query, scene, queryPlan, args) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return {provider: "pexels", skipped: true, reason: "PEXELS_API_KEY not set", candidates: []};

  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(args.maxPerScene));
  url.searchParams.set("orientation", orientationForProvider(queryPlan.desired_aspect));

  const json = await fetchJson(url, {Authorization: apiKey});
  const candidates = asArray(json.videos).flatMap((video) => {
    if (Number(video.duration ?? 0) < queryPlan.min_duration_sec) return [];
    const file = choosePexelsFile(video.video_files, queryPlan.desired_aspect);
    if (!file?.link) return [];
    return [stockCandidate({
      provider: "pexels",
      providerAssetId: String(video.id ?? shortHash(file.link)),
      sceneId: scene.scene_id,
      query,
      sourceUrl: video.url || file.link,
      previewUrl: video.image || "",
      downloadUrl: file.link,
      duration: video.duration,
      width: file.width,
      height: file.height,
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      fitReason: "Matched Pexels video search query, aspect, and minimum duration.",
    })];
  });
  return {provider: "pexels", skipped: false, query, candidates};
}

async function searchPixabay(query, scene, queryPlan, args) {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return {provider: "pixabay", skipped: true, reason: "PIXABAY_API_KEY not set", candidates: []};

  const url = new URL("https://pixabay.com/api/videos/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", String(args.maxPerScene));
  url.searchParams.set("video_type", "all");

  const json = await fetchJson(url);
  const candidates = asArray(json.hits).flatMap((hit) => {
    if (Number(hit.duration ?? 0) < queryPlan.min_duration_sec) return [];
    const file = choosePixabayFile(hit.videos, queryPlan.desired_aspect);
    if (!file?.url) return [];
    return [stockCandidate({
      provider: "pixabay",
      providerAssetId: String(hit.id ?? shortHash(file.url)),
      sceneId: scene.scene_id,
      query,
      sourceUrl: hit.pageURL || file.url,
      previewUrl: hit.picture_id ? `https://i.vimeocdn.com/video/${hit.picture_id}_640x360.jpg` : "",
      downloadUrl: file.url,
      duration: hit.duration,
      width: file.width,
      height: file.height,
      licenseName: "Pixabay Content License",
      licenseUrl: "https://pixabay.com/service/license-summary/",
      fitReason: "Matched Pixabay video query and minimum duration; final commercial risk still needs human review.",
    })];
  });
  return {provider: "pixabay", skipped: false, query, candidates};
}

async function searchCoverr(query, scene, queryPlan, args) {
  const apiKey = process.env.COVERR_API_KEY;
  if (!apiKey) return {provider: "coverr", skipped: true, reason: "COVERR_API_KEY not set", candidates: []};

  const url = new URL("https://api.coverr.co/videos");
  url.searchParams.set("query", query);
  url.searchParams.set("page_size", String(args.maxPerScene));
  url.searchParams.set("urls", "true");
  url.searchParams.set("sort", "popular");

  const json = await fetchJson(url, {Authorization: `Bearer ${apiKey}`});
  const candidates = asArray(json.hits).flatMap((video) => {
    const duration = Number.parseFloat(video?.duration ?? 0);
    if (!Number.isFinite(duration) || duration < queryPlan.min_duration_sec) return [];

    const downloadUrl = video?.urls?.mp4_download || video?.urls?.mp4 || video?.download_url || "";
    if (!downloadUrl) return [];

    const dimensions = coverrDimensions(video);
    const providerAssetId = String(video.id ?? video.slug ?? shortHash(downloadUrl));
    const sourceUrl = video.url || video.html_url || (video.slug ? `https://coverr.co/videos/${video.slug}` : "https://coverr.co");
    return [stockCandidate({
      provider: "coverr",
      providerAssetId,
      sceneId: scene.scene_id,
      query,
      sourceUrl,
      previewUrl: video.thumbnail || video.poster || video?.urls?.thumbnail || "",
      downloadUrl,
      duration,
      width: dimensions.width,
      height: dimensions.height,
      licenseName: "Coverr License",
      licenseUrl: "https://coverr.co/license",
      fitReason: "Matched Coverr video query and minimum duration; Coverr is mostly 16:9, so crop/letterbox fit must be checked in Remotion.",
    })];
  });
  return {provider: "coverr", skipped: false, query, candidates};
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {headers});
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

function choosePexelsFile(files, aspect) {
  const items = asArray(files).filter((file) => file?.link && file.width && file.height);
  return chooseByAspect(items, aspect, (file) => Number(file.width), (file) => Number(file.height));
}

function choosePixabayFile(videos, aspect) {
  const items = Object.values(videos ?? {}).filter((file) => file?.url && file.width && file.height);
  return chooseByAspect(items, aspect, (file) => Number(file.width), (file) => Number(file.height));
}

function coverrDimensions(video) {
  const width = Number(video?.width ?? video?.max_width ?? video?.metadata?.width ?? 0);
  const height = Number(video?.height ?? video?.max_height ?? video?.metadata?.height ?? 0);
  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0,
  };
}

function chooseByAspect(items, aspect, getWidth, getHeight) {
  const target = aspect === "16:9" ? 16 / 9 : aspect === "1:1" ? 1 : 9 / 16;
  return items
    .map((item) => {
      const width = getWidth(item);
      const height = getHeight(item);
      const ratio = width / height;
      const aspectPenalty = Math.abs(ratio - target);
      const sizeScore = width * height;
      return {item, aspectPenalty, sizeScore};
    })
    .sort((a, b) => a.aspectPenalty - b.aspectPenalty || b.sizeScore - a.sizeScore)[0]?.item;
}

function stockCandidate({
  provider,
  providerAssetId,
  sceneId,
  query,
  sourceUrl,
  previewUrl,
  downloadUrl,
  duration,
  width,
  height,
  licenseName,
  licenseUrl,
  fitReason,
}) {
  const assetId = `stock-${provider}-${shortHash(downloadUrl || sourceUrl)}`;
  return {
    asset_id: assetId,
    source_name: provider,
    source_url: sourceUrl,
    provider_asset_id: providerAssetId,
    search_query: query,
    preview_url: previewUrl,
    download_url: downloadUrl,
    width: Number(width ?? 0),
    height: Number(height ?? 0),
    duration_sec: Number(duration ?? 0),
    license_name: licenseName,
    license_url: licenseUrl,
    commercial_use_status: "manual_review_required",
    attribution_required: false,
    attribution_text: "",
    people_or_model_release_risk: "manual_review_required",
    trademark_or_brand_risk: "manual_review_required",
    property_or_landmark_risk: "manual_review_required",
    intended_scene_ids: [sceneId],
    role: "broll_plate",
    local_path: "",
    checksum_sha256: "",
    downloaded_at: "",
    decision: "pending",
    fit_score: 0.6,
    fit_reason: fitReason,
    reject_reason: "",
    notes: "Resolve license, people/brand/property risk, and decision before selecting.",
  };
}

async function searchStockCandidates(report, scenes, args) {
  if (!args.search) {
    report.provider_status.push({provider: "all", status: "skipped", reason: "--dry-run or --no-search was used"});
    return;
  }

  const seenUrls = new Set(report.candidates.map((candidate) => candidate.download_url || candidate.source_url));
  for (const scene of scenes) {
    const queryPlan = report.query_plan.find((item) => item.scene_id === scene.scene_id);
    if (!queryPlan?.queries?.length) continue;
    for (const query of queryPlan.queries) {
      for (const provider of args.providers) {
        try {
          const result =
            provider === "pexels"
              ? await searchPexels(query, scene, queryPlan, args)
              : provider === "pixabay"
                ? await searchPixabay(query, scene, queryPlan, args)
                : provider === "coverr"
                  ? await searchCoverr(query, scene, queryPlan, args)
                  : {provider, skipped: true, reason: "unsupported provider", candidates: []};
          report.provider_status.push({
            provider,
            query,
            scene_id: scene.scene_id,
            status: result.skipped ? "skipped" : "searched",
            reason: result.reason || "",
            candidate_count: result.candidates.length,
          });
          for (const candidate of result.candidates) {
            const uniqueUrl = candidate.download_url || candidate.source_url;
            if (seenUrls.has(uniqueUrl)) continue;
            seenUrls.add(uniqueUrl);
            report.candidates.push(candidate);
          }
        } catch (error) {
          report.provider_status.push({
            provider,
            query,
            scene_id: scene.scene_id,
            status: "failed",
            reason: error.message,
            candidate_count: 0,
          });
        }
      }
    }
  }

  report.stock_candidates = report.candidates;
}

function buildReport(state, args) {
  const aspect = getAspect(state);
  const scenes = extractScenes(state);
  const globalAssetLibrary = loadGlobalAssetRegistry(args, scenes);
  const scenePlans = scenes.map((scene) => {
    const classification = classifyScene(scene);
    return {scene, classification, queryPlan: buildQueryPlan(scene, classification, aspect, args.minDuration)};
  });

  const imagegenRequests = scenePlans
    .map(({scene, classification}) => buildImagegenRequest(scene, classification, args))
    .filter(Boolean);
  const veoRequests = scenePlans
    .map(({scene, classification}) => buildVeoRequest(scene, classification, args))
    .filter(Boolean)
    .map((request) => ({...request, aspect_ratio: aspect}));

  return {
    report_kind: "xingchen_material_route_scout",
    schema_version: "1.0",
    project_id: state.metadata?.project_id || "",
    project_root: args.projectRoot,
    created_at: nowIso(),
    scout_reason: "Route current scene needs through global assets, stock footage, imagegen plates, Veo-style video plates, and Remotion precision layers.",
    route_order: [
      "global_asset_library",
      "stock_footage",
      "imagegen_plate",
      "veo_video_generation",
      "remotion_precision_layer",
    ],
    global_asset_library: globalAssetLibrary,
    scene_needs: scenePlans.map(({scene, classification}) => ({
      scene_id: scene.scene_id,
      visual_job: scene.intent || scene.dominant_anchor || scene.scene_job,
      need_type: classification.need_type,
      why_stock_footage: classification.stock_search
        ? "Try real commercially usable b-roll before generation."
        : "Stock footage is not appropriate for precision/proof/source-media scenes.",
      why_imagegen_or_veo: classification.imagegen_request || classification.veo_request
        ? classification.why
        : "Generated imagery/video would compete with audit-critical Remotion content.",
      fallback_if_rejected: classification.final_default === "remotion_precision_layer"
        ? "Build or keep a code-native Remotion/SVG/Canvas/source-media scene."
        : "Use a simpler Remotion-native motion plate if stock/imagegen/Veo candidates fail lookdev.",
      remotion_precision_layer_required: true,
    })),
    fallback_chain: scenePlans.map(({scene, classification}) => buildFallbackChain(scene, classification)),
    query_plan: scenePlans.map(({queryPlan}) => queryPlan),
    stock_candidates: [],
    candidates: [],
    imagegen_requests: imagegenRequests,
    veo_video_requests: veoRequests,
    rejected: [],
    provider_status: [],
    derived_artifacts: {
      imagegen_prompt_pack_json: imagegenRequests.length ? args.imagegenOutput : "",
      imagegen_prompt_pack_md: imagegenRequests.length ? args.imagegenMdOutput : "",
      veo_video_request_json: veoRequests.length ? args.veoOutput : "",
      veo_video_request_md: veoRequests.length ? args.veoMdOutput : "",
    },
    remotion_integration: {
      video_plate_scene_ids: veoRequests.flatMap((request) => request.scene_ids),
      background_or_transition_scene_ids: imagegenRequests.map((request) => request.scene_id),
      captions_and_proof_owned_by_remotion: true,
      attribution_placement: "Project description or end card only when the selected source license requires attribution.",
    },
  };
}

async function downloadSelected(report, args) {
  const selected = report.candidates.filter((candidate) => candidate.decision === "selected");
  if (!selected.length) return {selected_assets: [], project_usage_manifest_path: ""};

  const unresolved = selected.flatMap((candidate) => {
    const issues = [];
    if (candidate.commercial_use_status !== "allowed" && candidate.commercial_use_status !== "allowed_with_attribution") {
      issues.push("commercial_use_status");
    }
    for (const key of ["people_or_model_release_risk", "trademark_or_brand_risk", "property_or_landmark_risk"]) {
      if (!["none", "low"].includes(candidate[key])) issues.push(key);
    }
    if ((candidate.attribution_required === true || candidate.commercial_use_status === "allowed_with_attribution") && !hasText(candidate.attribution_text)) {
      issues.push("attribution_text");
    }
    if (!hasText(candidate.download_url)) issues.push("download_url");
    return issues.length ? [`${candidate.asset_id}: ${issues.join(", ")}`] : [];
  });
  if (unresolved.length) {
    throw new Error(`Selected stock candidates must resolve license/risk/download fields before download:\n- ${unresolved.join("\n- ")}`);
  }

  const stockDir = path.join(args.globalRoot, "stock-video");
  fs.mkdirSync(stockDir, {recursive: true});
  const selectedAssets = [];

  for (const candidate of selected) {
    if (!candidate.download_url) {
      throw new Error(`Selected candidate ${candidate.asset_id} has no download_url`);
    }
    const providerDir = path.join(stockDir, normalizeId(candidate.source_name || "provider"));
    fs.mkdirSync(providerDir, {recursive: true});
    const outputPath = path.join(providerDir, `${candidate.asset_id}.mp4`);
    if (!fs.existsSync(outputPath)) {
      const response = await fetch(candidate.download_url);
      if (!response.ok) throw new Error(`Download failed for ${candidate.asset_id}: HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outputPath, bytes);
    }
    const bytes = fs.readFileSync(outputPath);
    candidate.local_path = outputPath;
    candidate.checksum_sha256 = sha256(bytes);
    candidate.downloaded_at = candidate.downloaded_at || nowIso();
    selectedAssets.push(candidate);
  }

  updateGlobalRegistry(selectedAssets, args, report.project_id);
  const usagePath = writeProjectUsage(report, selectedAssets, args);
  writeReadyMaterials(report, selectedAssets, usagePath, args);
  return {selected_assets: selectedAssets, project_usage_manifest_path: usagePath};
}

function updateGlobalRegistry(selectedAssets, args, projectId) {
  const registryDir = path.join(args.globalRoot, "registry");
  const registryPath = path.join(registryDir, "asset-registry.json");
  fs.mkdirSync(registryDir, {recursive: true});
  const registry = fs.existsSync(registryPath)
    ? readJson(registryPath)
    : {
        schema_version: "1.0",
        updated_at: "",
        library_root: args.globalRoot,
        policy: "Reusable Xingchen visual assets. Check this registry before new downloads or generation.",
        assets: [],
      };
  registry.assets = asArray(registry.assets);

  for (const candidate of selectedAssets) {
    const record = {
      asset_id: candidate.asset_id,
      asset_group: `stock-footage-${reportDateSlug()}`,
      asset_type: "stock_video",
      title: `${candidate.source_name} ${candidate.asset_id}`,
      source_name: candidate.source_name,
      source_url: candidate.source_url,
      license: candidate.license_name,
      license_url: candidate.license_url,
      local_path: candidate.local_path,
      checksum_sha256: candidate.checksum_sha256,
      tags: ["xingchen", "stock-footage", "video-plate"],
      visual_roles: [candidate.role || "broll_plate"],
      best_for: ["Remotion-controlled b-roll plates", "background motion", "transition texture"],
      do_not_use_for: ["literal proof", "readable UI evidence", "standalone resale", "brand endorsement"],
      provenance_file: "",
      used_in_projects: [projectId].filter(Boolean),
    };
    const existingIndex = registry.assets.findIndex((asset) => asset.asset_id === record.asset_id);
    if (existingIndex >= 0) {
      registry.assets[existingIndex] = {...registry.assets[existingIndex], ...record};
    } else {
      registry.assets.push(record);
    }
  }
  registry.updated_at = nowIso();
  writeJson(registryPath, registry);
}

function reportDateSlug() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

function writeProjectUsage(report, selectedAssets, args) {
  const usageDir = path.join(args.globalRoot, "registry", "project-usages");
  fs.mkdirSync(usageDir, {recursive: true});
  const usagePath = path.join(usageDir, `${normalizeId(report.project_id || "project")}.json`);
  const usage = {
    project_id: report.project_id,
    project_root: report.project_root,
    created_at: nowIso(),
    selected_assets: selectedAssets.map((asset) => ({
      asset_id: asset.asset_id,
      role_in_video: asset.role || "broll_plate",
      scene_ids: asset.intended_scene_ids,
      usage_mode: "reference_global",
      project_local_path: "",
      notes: asset.fit_reason || "",
    })),
  };
  writeJson(usagePath, usage);
  return usagePath;
}

function writeReadyMaterials(report, selectedAssets, usagePath, args) {
  const readyDir = path.join(args.projectRoot, "_ready_materials");
  fs.mkdirSync(readyDir, {recursive: true});
  const lines = [
    "# Asset Library Reference",
    "",
    `- project_id: ${report.project_id}`,
    `- project_usage_manifest: ${usagePath}`,
    "",
    "| asset_id | scenes | role | global path |",
    "|---|---|---|---|",
    ...selectedAssets.map((asset) =>
      `| ${asset.asset_id} | ${asArray(asset.intended_scene_ids).join(", ")} | ${asset.role || "broll_plate"} | ${asset.local_path} |`
    ),
    "",
    "Remotion owns subtitles, proof overlays, labels, timing, and final composition for every selected asset.",
    "",
  ];
  fs.writeFileSync(path.join(readyDir, "asset-library-reference.md"), `${lines.join("\n")}\n`, "utf8");
}

function writeDerivedPromptPacks(report, args) {
  if (report.imagegen_requests.length) {
    writeJson(args.imagegenOutput, {
      prompt_pack_kind: "xingchen_imagegen_plate_requests",
      created_at: nowIso(),
      requests: report.imagegen_requests,
      precision_layer_policy: "Imagegen owns plates only; Remotion owns text, proof, labels, charts, routes, subtitles, and timing.",
    });
    fs.mkdirSync(path.dirname(args.imagegenMdOutput), {recursive: true});
    fs.writeFileSync(args.imagegenMdOutput, renderImagegenMarkdown(report.imagegen_requests), "utf8");
  }
  if (report.veo_video_requests.length) {
    writeJson(args.veoOutput, {
      request_pack_kind: "xingchen_veo_video_plate_requests",
      created_at: nowIso(),
      provider: "veo_video_generation",
      requests: report.veo_video_requests,
      controller_policy: "Veo-style output is a bounded video_plate; Remotion remains the final controller.",
    });
    fs.mkdirSync(path.dirname(args.veoMdOutput), {recursive: true});
    fs.writeFileSync(args.veoMdOutput, renderVeoMarkdown(report.veo_video_requests), "utf8");
  }
}

function renderImagegenMarkdown(requests) {
  return [
    "# Imagegen Prompt Pack",
    "",
    "Imagegen creates only clean plates. Remotion owns all text, proof, labels, charts, subtitles, and timing.",
    "",
    ...requests.flatMap((request) => [
      `## ${request.request_id}`,
      "",
      `- scene_id: ${request.scene_id}`,
      `- status: ${request.status}`,
      `- visual_job: ${request.visual_job}`,
      `- proof_role: ${request.proof_role}`,
      "",
      "Prompt:",
      "",
      request.prompt,
      "",
      "Negative prompt:",
      "",
      request.negative_prompt,
      "",
      "Overlay plan:",
      "",
      request.overlay_plan,
      "",
    ]),
  ].join("\n");
}

function renderVeoMarkdown(requests) {
  return [
    "# Veo Video Request Pack",
    "",
    "These are prompt-only handoffs. Generated video may only enter final work as a muted Remotion video_plate.",
    "",
    ...requests.flatMap((request) => [
      `## ${request.request_id}`,
      "",
      `- scenes: ${request.scene_ids.join(", ")}`,
      `- provider: ${request.provider}`,
      `- model hint: ${request.provider_model_hint}`,
      `- route: ${request.technical_route}`,
      `- duration: ${request.duration_sec}s`,
      `- aspect: ${request.aspect_ratio}`,
      "",
      "Prompt:",
      "",
      request.prompt_text,
      "",
      "Negative prompt:",
      "",
      request.negative_prompt,
      "",
      "Proof exclusion:",
      "",
      request.proof_exclusion_policy,
      "",
      "Remotion integration:",
      "",
      request.remotion_integration_plan,
      "",
    ]),
  ].join("\n");
}

function writeScoutMarkdown(report, filePath) {
  const lines = [
    "# Material Route Scout",
    "",
    `- project_id: ${report.project_id}`,
    `- project_root: ${report.project_root}`,
    `- created_at: ${report.created_at}`,
    `- scout_reason: ${report.scout_reason}`,
    "",
    "## Scene Needs",
    "",
    "| scene_id | need_type | visual job | fallback |",
    "|---|---|---|---|",
    ...report.scene_needs.map((need) =>
      `| ${need.scene_id} | ${need.need_type} | ${escapePipe(need.visual_job)} | ${escapePipe(need.fallback_if_rejected)} |`
    ),
    "",
    "## Query Plan",
    "",
    "| scene_id | queries |",
    "|---|---|",
    ...report.query_plan.map((plan) => `| ${plan.scene_id} | ${escapePipe(asArray(plan.queries).join("; "))} |`),
    "",
    "## Stock Candidates",
    "",
    "| asset_id | source | scenes | status | decision |",
    "|---|---|---|---|---|",
    ...report.candidates.map((candidate) =>
      `| ${candidate.asset_id} | ${candidate.source_name} | ${asArray(candidate.intended_scene_ids).join(", ")} | ${candidate.commercial_use_status} | ${candidate.decision} |`
    ),
    "",
    "## Imagegen Requests",
    "",
    ...report.imagegen_requests.map((request) => `- ${request.request_id}: ${request.scene_id} (${request.status})`),
    "",
    "## Veo Video Requests",
    "",
    ...report.veo_video_requests.map((request) => `- ${request.request_id}: ${request.scene_ids.join(", ")} (${request.status})`),
    "",
    "## Remotion Integration",
    "",
    `- captions_and_proof_owned_by_remotion: ${report.remotion_integration.captions_and_proof_owned_by_remotion}`,
    `- video_plate_scene_ids: ${report.remotion_integration.video_plate_scene_ids.join(", ")}`,
    "",
  ];
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function escapePipe(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function writeState(state, report, args, usageManifestPath) {
  state.visual ??= {};
  state.visual.director_board ??= {};
  state.visual.director_board.brainstorming_contract ??= {};
  const preflight = state.visual.director_board.brainstorming_contract.resource_preflight ?? {};
  state.visual.director_board.brainstorming_contract.resource_preflight = preflight;

  preflight.stock_footage_scout_path = args.output;
  preflight.global_asset_registry_checked = report.global_asset_library?.checked === true;
  preflight.global_asset_candidate_ids = unique([
    ...asArray(preflight.global_asset_candidate_ids),
    ...asArray(report.global_asset_library?.candidate_ids),
  ]);
  preflight.project_usage_manifest_path =
    usageManifestPath || preflight.project_usage_manifest_path || "not_needed_no_selected_stock_or_generated_assets_yet";
  preflight.stock_footage_candidates = report.candidates
    .filter((candidate) => candidate.decision === "selected")
    .map((candidate) => ({
      asset_id: candidate.asset_id,
      source_name: candidate.source_name,
      source_url: candidate.source_url,
      license_url: candidate.license_url,
      commercial_use_status: candidate.commercial_use_status,
      attribution_required: candidate.attribution_required,
      attribution_text: candidate.attribution_text,
      people_or_model_release_risk: candidate.people_or_model_release_risk,
      trademark_or_brand_risk: candidate.trademark_or_brand_risk,
      property_or_landmark_risk: candidate.property_or_landmark_risk,
      intended_scene_ids: candidate.intended_scene_ids,
      role: candidate.role,
      local_path: candidate.local_path,
      checksum_sha256: candidate.checksum_sha256,
      decision: candidate.decision,
    }));
  preflight.prompt_pack_paths = unique([
    ...asArray(preflight.prompt_pack_paths),
    ...(report.imagegen_requests.length ? [args.imagegenOutput] : []),
    ...(report.veo_video_requests.length ? [args.veoOutput] : []),
  ]);
  preflight.selected_routes ??= {};
  if (report.imagegen_requests.length) {
    preflight.selected_routes.imagegen_models_or_skills = unique([
      ...asArray(preflight.selected_routes.imagegen_models_or_skills),
      "imagegen",
    ]);
  }
  if (report.veo_video_requests.length) {
    preflight.selected_routes.ai_video_models_or_skills = unique([
      ...asArray(preflight.selected_routes.ai_video_models_or_skills),
      "veo_video_generation",
    ]);
  }

  state.render ??= {};
  state.render.ai_video_prompt_requests ??= [];
  for (const request of report.veo_video_requests) {
    const index = state.render.ai_video_prompt_requests.findIndex((item) => item?.request_id === request.request_id);
    if (index >= 0) {
      state.render.ai_video_prompt_requests[index] = request;
    } else {
      state.render.ai_video_prompt_requests.push(request);
    }
  }
  state.render.scene_motion_specs ??= [];
  for (const request of report.veo_video_requests) {
    for (const sceneId of asArray(request.scene_ids)) {
      const spec = state.render.scene_motion_specs.find((item) => item?.scene_id === sceneId);
      if (!spec) continue;
      spec.ai_video_prompt_request_ids = unique([
        ...asArray(spec.ai_video_prompt_request_ids),
        request.request_id,
      ]);
      if (!hasText(spec.render_mode)) spec.render_mode = "gen_insert";
      if (!hasText(spec.renderer_family)) spec.renderer_family = "remotion_component";
      if (!hasText(spec.execution_runtime)) spec.execution_runtime = "remotion";
      if (!hasText(spec.motion_source)) spec.motion_source = "ai_video_generation";
      if (!hasText(spec.integration_mode)) spec.integration_mode = "video_plate";
      if (!hasText(spec.promotion_target_renderer_family)) {
        spec.promotion_target_renderer_family = "remotion_component";
      }
    }
  }

  state.sources ??= {};
  state.sources.asset_manifest ??= [];
  for (const candidate of report.candidates.filter((item) => item.decision === "selected" && item.local_path)) {
    const asset = {
      asset_id: candidate.asset_id,
      file_path: candidate.local_path,
      asset_type: "video",
      summary: `Selected ${candidate.source_name} stock footage for scenes ${asArray(candidate.intended_scene_ids).join(", ")}`,
      topic_tags: ["stock-footage", "video-plate"],
      proof_candidate: false,
      review_status: "reviewed",
    };
    const index = state.sources.asset_manifest.findIndex((item) => item?.asset_id === asset.asset_id);
    if (index >= 0) state.sources.asset_manifest[index] = asset;
    else state.sources.asset_manifest.push(asset);
  }

  state.metadata ??= {};
  state.metadata.updated_at = nowIso();
  writeJson(args.state, state);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const state = readJson(args.state);
  let report = fs.existsSync(args.output) && args.download === "selected"
    ? readJson(args.output)
    : buildReport(state, args);
  const scenes = extractScenes(state);

  if (args.download !== "selected") {
    await searchStockCandidates(report, scenes, args);
  }

  let usageManifestPath = "";
  if (args.download === "selected") {
    const result = await downloadSelected(report, args);
    usageManifestPath = result.project_usage_manifest_path;
  }

  report.stock_candidates = report.candidates;
  writeDerivedPromptPacks(report, args);
  writeJson(args.output, report);
  writeScoutMarkdown(report, args.mdOutput);
  if (args.writeState) writeState(state, report, args, usageManifestPath);

  console.log(`Material route scout written: ${args.output}`);
  console.log(`Markdown report written: ${args.mdOutput}`);
  if (report.imagegen_requests.length) console.log(`Imagegen prompt pack written: ${args.imagegenOutput}`);
  if (report.veo_video_requests.length) console.log(`Veo request pack written: ${args.veoOutput}`);
  if (report.global_asset_library?.error) {
    console.warn(`Global asset registry check failed: ${report.global_asset_library.error}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
