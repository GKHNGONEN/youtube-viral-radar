"""
Reverse-Engineering & Storyboard Extractor for AI Videos
Uses: yt-dlp + PySceneDetect (or FFmpeg fallback)
Saves images cleanly with PIL to prevent Windows non-ASCII path encoding issues.
"""
import os
import sys
import json
import subprocess
from pathlib import Path
from PIL import Image

def download_video(url, output_dir="downloads"):
    os.makedirs(output_dir, exist_ok=True)
    
    video_id = None
    if "v=" in url:
        video_id = url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1].split("?")[0]
    elif "shorts/" in url:
        video_id = url.split("shorts/")[1].split("?")[0]

    if video_id:
        for f in os.listdir(output_dir):
            if f.startswith(video_id) and f.endswith(('.mp4', '.mkv', '.webm')):
                existing_path = os.path.join(output_dir, f)
                print(f"[CACHE] Found existing video: {existing_path}")
                return existing_path, "Cached Video", video_id, {}

    out_tmpl = os.path.join(output_dir, "%(id)s.%(ext)s")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[ext=mp4]/best",
        "-o", out_tmpl,
        "--no-playlist",
        url
    ]
    print(f"[DOWNLOAD] Downloading: {url}")
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        cmd_fallback = [sys.executable, "-m", "yt_dlp", "-o", out_tmpl, "--no-playlist", url]
        res = subprocess.run(cmd_fallback, capture_output=True, text=True, encoding="utf-8")
        if res.returncode != 0:
            raise RuntimeError(f"Download failed: {res.stderr}")

    info_cmd = [sys.executable, "-m", "yt_dlp", "--dump-json", url]
    info_res = subprocess.run(info_cmd, capture_output=True, text=True, encoding="utf-8")
    if info_res.returncode == 0:
        info = json.loads(info_res.stdout)
        vid = info.get("id")
        title = info.get("title")
        ext = info.get("ext", "mp4")
        video_path = os.path.join(output_dir, f"{vid}.{ext}")
        if not os.path.exists(video_path):
            for f in os.listdir(output_dir):
                if f.startswith(vid):
                    video_path = os.path.join(output_dir, f)
                    break
        return video_path, title, vid, info
    else:
        raise RuntimeError("Could not retrieve video info.")

def save_cv2_frame(frame, target_path):
    import cv2
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb)
    img.save(target_path, quality=92)

def generate_scene_prompt(idx, total, duration, title, category="", keyword=""):
    """
    Her nişe özel, organik ve sinematografik Text-to-Video prompt motoru.
    Kategoriye göre doğru optik, kamera açısı ve aydınlatmayı otomatik seçer:
    - Antik Gizemler: BBC/National Geographic belgesel kamerası, meşale ışığı, altın saat, arkeolojik detay.
    - Yükseklik Korkusu: Balıkgözü vertigo açısı, gökdelen kenarı, şiddetli rüzgar hissi.
    - Karanlık Doğa/Derin Deniz: Denizaltı ROV kamerası, biyolüminesans ışık, deniz sisi/tortu.
    - Trafik/Karma: 1080p araç içi kamera (dashcam), sokak lambaları, gerçek zamanlı hareket.
    - Sinematik Yapay Zeka: 35mm Arri/Panavision, doğal loş ışık, gerçekçi yüz mikro-mimikleri.
    - Ekstrem Spor: Ham GoPro POV, 70-200mm pist kamerası, yüksek örtücü hızı, gerçek hız.
    """
    context_str = f"{title} {category} {keyword}".lower()
    clean_title = title.replace("|", "-").replace('"', '').strip()
    
    # Niş Kontrolleri (16 Farklı Niş Ayrımı)
    is_metaphysics = any(k in context_str for k in ['metafizik', 'metaphysic', 'matrix', 'glitch', 'paralel', 'parallel', 'astral', 'liminal', 'backrooms', 'simulation', 'simülasyon', 'kuantum', 'quantum'])
    is_space = any(k in context_str for k in ['uzay', 'space', 'kara delik', 'black hole', 'kozmik', 'cosmic', 'nasa', 'james webb', 'galaxy', 'universe'])
    is_urbex = any(k in context_str for k in ['terk', 'abandoned', 'sığınak', 'bunker', 'mansion', 'urbex', 'ghost town', 'hospital', 'hayalet'])
    is_cataclysms = any(k in context_str for k in ['felaket', 'cataclysm', 'tornado', 'kasırga', 'tsunami', 'volcano', 'yanardağ', 'lightning', 'fırtına', 'flood'])
    is_mythology = any(k in context_str for k in ['mitoloji', 'mythology', 'viking', 'ragnarok', 'roma', 'roman', 'legion', 'samurai', 'siege', 'savaş', 'battle', 'gods'])
    is_cyberpunk = any(k in context_str for k in ['siberpunk', 'cyberpunk', '2080', 'distopya', 'dystopia', 'robot', 'humanoid', 'singularity', 'transhumanism'])
    is_satisfying = any(k in context_str for k in ['tatmin', 'satisfying', 'restorasyon', 'restoration', 'hydraulic', 'press', 'kılıç', 'sword', 'cleaning', 'pressure washing'])
    is_wildlife = any(k in context_str for k in ['yırtıcı', 'predator', 'polar bear', 'tiger', 'kutup ayısı', 'crocodile', 'snake', 'vahşi doğa', 'wildlife'])
    is_megaprojects = any(k in context_str for k in ['megaproject', 'mühendislik', 'oil rig', 'petrol platform', 'tünel', 'tunnel', 'cargo ship', 'kargo gemisi'])
    is_retro = any(k in context_str for k in ['retro', 'soğuk savaş', 'cold war', 'unsolved', 'çözülmemiş', 'vintage', 'kayboluş', 'disappearance', 'numbers station'])
    is_ancient = any(k in context_str for k in ['antik', 'ancient', 'gizem', 'mystery', 'tarih', 'history', 'tomb', 'pyramid', 'tapınak', 'temple', 'ruin', 'civilization', 'arkeoloji', 'monolith'])
    is_heights = any(k in context_str for k in ['yükseklik', 'height', 'palms', 'uçurum', 'cliff', 'crane', 'skyscraper', 'gökdelen', 'roof', 'vertigo', 'edge'])
    is_dark_nature = any(k in context_str for k in ['doğa', 'nature', 'derin', 'deep', 'sea', 'ocean', 'creature', 'yaratık', 'okyanus', 'underwater'])
    is_traffic = any(k in context_str for k in ['trafik', 'traffic', 'araba', 'car', 'dashcam', 'cctv', 'karma', 'street', 'crash', 'road'])
    is_action_sports = any(k in context_str for k in ['enduro', 'climb', 'bike', 'motor', 'race', 'drift', 'extreme', 'spor', 'jump', 'downhill'])

    # 1. 👁️ METAFİZİK, PARALEL EVRENLER & SİMÜLASYON
    if is_metaphysics:
        if idx == 1:
            camera = "Analog uncanny surveillance perspective, subtle 1990s VHS tape magnetic distortion, eerily quiet liminal lighting"
            physics = "Unsettling reality glitch, subtle micro-stutter in physical space, surreal liminal room ambiance, uncanny valley atmosphere"
        elif idx == total:
            camera = "Floating dreamlike POV tracking forward into an infinite liminal corridor, soft buzzing fluorescent flicker"
            physics = "Interdimensional spatial warping, eerie silence, authentic analog video grain, metaphysical psychological dread"
        else:
            camera = "Static wide security camera frame, desaturated liminal color palette"
            physics = "Unexplained reality anomaly, sudden quantum phase shift, authentic eerie surrealism without CGI gloss"
        return f"{camera}, metaphysical event study inspired by '{clean_title}'. {physics}, analog texture, authentic liminal dread pacing."

    # 2. 🌌 UZAY, KARA DELİKLER & KOZMİK KORKU
    elif is_space:
        if idx == 1:
            camera = "IMAX 70mm astronomical camera, deep field space sensor, cosmic scale perspective"
            physics = "Majestic slow cosmic drift past monolithic celestial body, stark contrasts of pitch black vacuum and burning accretion disk, awe-inspiring interstellar scale"
        elif idx == total:
            camera = "Hypnotic orbital perspective directly above a swirling supermassive black hole event horizon"
            physics = "Extreme gravitational lensing bending background starlight, deep vacuum silence, hyper-dense relativistic physics, cosmic scale"
        else:
            camera = "Cinematic spacecraft external telemetry camera, raw unfiltered space lighting"
            physics = "Silent majestic rotational drift, authentic cosmic particulate reflections, Christopher Nolan Interstellar scale"
        return f"{camera}, cosmic spectacle inspired by '{clean_title}'. {physics}, natural 24fps motion, authentic deep space majesty."

    # 3. 🏚️ TERK EDİLMİŞ YERLER & GİZLİ SIĞINAKLAR (URBEX)
    elif is_urbex:
        if idx == 1:
            camera = "Handheld camera mounted with single 1000-lumen LED work-light beam, dusty 35mm anamorphic lens"
            physics = "Slow cautious footstep pacing into a massive forgotten subterranean chamber, floating dust motes in flashlight cone, authentic decay"
        elif idx == total:
            camera = "Low-angle tracking shot revealing rusted blast doors and overgrown forgotten architecture"
            physics = "Peeling paint textures, authentic rusted iron patina, cold draft moving cobwebs, genuine urban exploration tension"
        else:
            camera = "POV flashlight search perspective, gritty documentary framing"
            physics = "Natural handheld camera wobble, sudden audio-visual tension, authentic unedited abandoned location atmosphere"
        return f"{camera}, raw urbex exploration of '{clean_title}'. {physics}, natural dark shadows, real handheld documentary cadence."

    # 4. 🌪️ DOĞA FELAKETLERİ & FIRTINA AVCILARI
    elif is_cataclysms:
        if idx == 1:
            camera = "Storm chaser reinforced vehicle dashboard camera, rain-streaked heavy telephoto lens"
            physics = "Violent rotating supercell mesocyclone lowering over open highway, green-tinted hail sky, authentic raw wind buffeting vehicle"
        elif idx == total:
            camera = "Wide ground-level tripod camera capturing raw shockwave debris blast against stormy horizon"
            physics = "Violent kinetic nature fury, authentic debris vortex, lightning strobe illuminating wall of rain, real-time terrifying speed"
        else:
            camera = "Handheld camera behind protective glass, rapid frantic zoom"
            physics = "Real-time sudden torrential downburst, authentic natural catastrophe scale, unpolished emergency broadcast feel"
        return f"{camera}, capturing the raw power of '{clean_title}'. {physics}, authentic natural storm lighting, real-time adrenaline."

    # 5. ⚔️ MİTOLOJİ & ANTİK SAVAŞLAR
    elif is_mythology:
        if idx == 1:
            camera = "Epic 35mm cinematic film camera, low tracking shot across mist-covered ancient battlefield"
            physics = "Slow atmospheric advance of shield wall, mud-caked armor, breath condensing in freezing dawn air, flickering torches"
        elif idx == total:
            camera = "Intense shoulder-mounted battle camera, close combat clash perspective"
            physics = "High shutter speed, kinetic impact of iron weapons, flying earth and sparks, authentic historical blood-pumping grit"
        else:
            camera = "Medium heroic portrait framing, natural practical overcast lighting"
            physics = "Grim determination in weathered eyes, authentic woven wool and forged iron textures, historical cinematic realism"
        return f"{camera}, historical saga inspired by '{clean_title}'. {physics}, organic Kodak 5219 film stock, authentic epic battlefield cadence."

    # 6. 🦾 GELECEK DİSTOPYASI & SİBERPUNK 2080
    elif is_cyberpunk:
        if idx == 1:
            camera = "Anamorphic Panavision lens, Arri Alexa, high-angle wet skyscraper balcony looking down into neon-drenched smog canyon"
            physics = "Volumetric acid rain falling through neon sign glow, soaring autonomous aerodynamic craft, Blade Runner 2049 aesthetic"
        elif idx == total:
            camera = "Intimate macro eye-level shot on cybernetic mechanical eye iris aperture adjusting"
            physics = "Micro-servo motor twitch, authentic brushed titanium and carbon fiber textures, soft neon rim reflections, grounded sci-fi realism"
        else:
            camera = "Tracking street-level shot through dense overcrowded dystopian megacity market"
            physics = "Steam vents hissing, holographic advertisements flickering on damp surfaces, gritty tactile futuristic world-building"
        return f"{camera}, dystopian future study of '{clean_title}'. {physics}, authentic cinematic shadows, organic sci-fi atmosphere."

    # 7. ✨ KUSURSUZ TATMİN & RESTORASYON
    elif is_satisfying:
        if idx == 1:
            camera = "Macro probe lens 4K ultra-close focus, bright softbox clinical studio lighting"
            physics = "Ultra-crisp razor sharp focus, thick encrusted rust peeling away cleanly from ancient forged steel blade under precision laser"
        elif idx == total:
            camera = "Smooth motorized slider tracking shot across mirror-polished pristine metal surface"
            physics = "Flawless light reflection glinting along Damascus steel edge, hypnotic tactile perfection, ultra-crisp micro-details"
        else:
            camera = "Overhead 90-degree workbench perspective, clean diffuse lighting"
            physics = "Hypnotic steady mechanical motion, fine metal shavings curling cleanly, deeply satisfying tactile sensory experience"
        return f"{camera}, satisfying transformation of '{clean_title}'. {physics}, studio lighting, pristine visual clarity."

    # 8. 🦁 VAHŞİ DOĞA & ZİRVE YIRTICILAR
    elif is_wildlife:
        if idx == 1:
            camera = "National Geographic 600mm f/4 super telephoto wildlife lens, low camouflage brush perspective"
            physics = "Tense motionless stalking in tall grass, heat shimmer across savanna, intense predatory pupil dilation, authentic wildlife suspense"
        elif idx == total:
            camera = "High-speed 1000fps tracking camera capturing explosive predatory strike"
            physics = "Real-time kinetic muscle ripple, flying dust spray under paws, authentic raw apex predator survival dynamics"
        else:
            camera = "Eye-level telephoto shot, natural golden savannah ambient lighting"
            physics = "Natural animal breathing, twitching ears listening to wind, authentic unscripted nature documentary realism"
        return f"{camera}, wildlife documentation inspired by '{clean_title}'. {physics}, natural colors, authentic BBC Earth pacing."

    # 9. 🏗️ DEVASA MÜHENDİSLİK & İMKANSIZ MEGAPROJELER
    elif is_megaprojects:
        if idx == 1:
            camera = "Industrial marine camera, extreme wide angle revealing massive steel offshore platform against towering 20-meter ocean waves"
            physics = "Brutal scale contrast, salty sea spray crashing over industrial catwalks, deep structural groaning against storm, awe-inspiring human engineering"
        elif idx == total:
            camera = "Helicopter aerial orbital surveying shot over colossal concrete dam or subterranean tunnel excavation"
            physics = "Immense industrial machinery operating in unison, heavy dust clouds, monumental human endeavor against raw earth"
        else:
            camera = "Heavy-duty worker perspective camera, dramatic hard-hat industrial scale"
            physics = "Real-time monumental hydraulic mechanics, industrial scale resilience, unpolished documentary awe"
        return f"{camera}, engineering marvel study of '{clean_title}'. {physics}, authentic industrial scale, real-world documentary power."

    # 10. 🕵️ ÇÖZÜLMEMİŞ DOSYALAR & RETRO GİZEMLER
    elif is_retro:
        if idx == 1:
            camera = "16mm vintage film camera, authentic black and white or faded Kodachrome 1970s color stock"
            physics = "Grainy archival footage aesthetic, authentic projector gate jitter, eerie Cold War era governmental debriefing room"
        elif idx == total:
            camera = "Static telephoto surveillance lens from shadowy parked sedan across rain-slicked midnight asphalt"
            physics = "Grainy low-light sensor, shadowy enigmatic figure vanishing into fog, authentic unsolved mystery archival authenticity"
        else:
            camera = "Close-up on redacted vintage dossier documents and black and white photographs under desk lamp"
            physics = "Subtle yellowed paper texture, authentic retro film scratches, cold unsettling historical documentary tone"
        return f"{camera}, historical investigation inspired by '{clean_title}'. {physics}, authentic 16mm grain, true mystery atmosphere."

    # 11. 🏛️ ANTİK GİZEMLER & TARİHİ BELGESEL
    elif is_ancient:
        if idx == 1:
            camera = "BBC documentary style, Sony FX9 cinema camera, wide majestic drone sweep, golden hour sunlight piercing through mist"
            physics = "Slow monumental camera push revealing ancient megalithic stone ruins, floating dust particles in sunbeams, awe-inspiring historical atmosphere"
        elif idx == total:
            camera = "Intimate ground-level tracking shot, warm flickering torchlight in a dark subterranean ancient chamber"
            physics = "Camera gently moving forward revealing mysterious undeciphered wall relief carvings, atmospheric ancient shadows, authentic archaeological discovery feeling"
        else:
            camera = "Medium cinematic documentary shot, natural overcast desert or jungle ambient lighting"
            physics = "Slow steady pan across ancient monolithic structures, weathered stone patina, realistic environmental scale, National Geographic documentary aesthetic"
        return f"{camera}, visual study inspired by '{clean_title}'. {physics}, natural historical textures, organic 24fps documentary pacing."

    # 12. 😱 YÜKSEKLİK KORKUSU & UÇURUM (SWEATY PALMS)
    elif is_heights:
        if idx == 1:
            camera = "Ultra wide-angle fisheye lens, extreme high-altitude perspective from the narrow ledge of a skyscraper"
            physics = "Vertigo camera tilting straight down to the miniature city streets below, gusty atmospheric wind, heart-racing real-time perspective"
        elif idx == total:
            camera = "POV helmet camera looking over an abyss edge, trembling fingers gripping cold weathered metal railing"
            physics = "Extreme depth perspective, realistic vertigo rush, authentic wind whistle against mic, unedited survival adrenaline"
        else:
            camera = "Low-angle dynamic action camera looking up against sheer vertical drop"
            physics = "Unfiltered daylight, genuine vertigo scale, natural real-time camera wobble, tense psychological atmosphere"
        return f"{camera}, capturing the dizzying heights of '{clean_title}'. {physics}, authentic natural lighting, intense vertigo realism, zero slow-motion."

    # 13. 🧠 KARANLIK DOĞA & DERİN DENİZ
    elif is_dark_nature:
        if idx == 1:
            camera = "Deep-sea research submersible ROV camera, ultra-sensitive low-light sensor, piercing halogen spotlight beam"
            physics = "Drifting through pitch-black murky ocean depths, organic marine snow particulates floating in light beam, eerie bioluminescent blue glow"
        elif idx == total:
            camera = "Cinematic macro shot of an enigmatic deep-sea specimen, soft ambient bioluminescent radiance"
            physics = "Slow fluid organic motion, realistic underwater fluid dynamics, National Geographic deep-sea realism"
        else:
            camera = "Atmospheric wide documentary perspective, shadowy natural environment"
            physics = "Ominous ambient natural lighting, deep environmental sound cues, realistic creature camouflage, untouched nature aesthetic"
        return f"{camera}, natural world exploration inspired by '{clean_title}'. {physics}, organic textures, authentic 24fps nature documentary cadence."

    # 14. 🚗 ANLIK KARMA & TRAFİK
    elif is_traffic:
        if idx == 1:
            camera = "Authentic 1080p vehicle dashcam perspective mounted behind rearview mirror, natural wide windshield view"
            physics = "Real-time road motion, natural overcast daylight, wet asphalt reflections, genuine traffic flow, unedited street realism"
        elif idx == total:
            camera = "High-angle corner street surveillance CCTV camera style, wide intersection view"
            physics = "Instant real-time reaction, realistic tire smoke, natural urban environment, raw unpolished incident documentation"
        else:
            camera = "Handheld street-level camera perspective, natural quick pan"
            physics = "Immediate genuine human reaction, raw real-time motion, natural ambient street lighting"
        return f"{camera}, capturing the real incident of '{clean_title}'. {physics}, genuine real-time physics, raw footage aesthetic."

    # 15. 🏍️ EKSTREM SPORLAR & AKSİYON
    elif is_action_sports:
        if idx == 1:
            camera = "Raw trackside camera shot, 70-200mm telephoto lens, natural outdoor sunlight"
            physics = "Real-time natural speed, high shutter speed capturing sharp spinning wheels, authentic dirt kick-up"
        elif idx == total:
            camera = "Wide handheld perspective, natural camera shake, unpolished documentary feel"
            physics = "Raw kinetic outcome, natural gravity and real-time physics, zero slow-motion, authentic impact dust"
        else:
            camera = "Raw GoPro Hero POV camera mounted low, wide-angle lens with natural barrel distortion"
            physics = "Aggressive high-speed real-time action, sudden violent steering twitch, flying mud hitting the lens, natural motion blur"
        return f"{camera}, capturing the intense action of '{clean_title}'. {physics}, authentic natural lighting, real raw footage aesthetic, natural 24fps motion."

    # 16. 🎬 SİNEMATİK YAPAY ZEKA FİLMLERİ & BİLİM KURGU / GOTİK (VARSAYILAN)
    else:
        if idx == 1:
            camera = "Shot on 35mm anamorphic prime lens, Arri Alexa, low-angle ground level framing"
            physics = "Natural 24fps movement, practical moody lighting, atmospheric real fog, authentic micro-textures"
        elif idx == total:
            camera = "Subtle cinematic orbital tracking shot, deep practical lighting, natural volumetric atmosphere"
            physics = "Fluid real-time character movement, genuine emotional tension, organic color grading without plastic glow"
        else:
            camera = "Medium cinematic two-shot, Panavision lens, soft diffused rim light"
            physics = "Natural real-time character interaction, genuine eye contact, realistic skin pores and organic shadows"
        return f"{camera}, scene inspired by '{clean_title}'. {physics}, organic Kodak 5219 film grain, authentic cinematic direction."

def detect_scenes_and_extract_keyframes(video_path, output_dir, title="AI Video", category="", keyword=""):
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        from scenedetect import open_video, SceneManager
        from scenedetect.detectors import ContentDetector
        import cv2
        
        print("[SCENE] Running PySceneDetect content detector...")
        video = open_video(video_path)
        scene_manager = SceneManager()
        scene_manager.add_detector(ContentDetector(threshold=24.0, min_scene_len=15))
        
        scene_manager.detect_scenes(video)
        scene_list = scene_manager.get_scene_list()
        
        scenes_data = []
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if not scene_list:
            step_frames = int(fps * 3.5)
            for idx, start_f in enumerate(range(0, total_frames, step_frames)):
                end_f = min(start_f + step_frames, total_frames)
                start_sec = start_f / fps
                end_sec = end_f / fps
                mid_frame = int((start_f + end_f) / 2)
                cap.set(cv2.CAP_PROP_POS_FRAMES, mid_frame)
                ret, frame = cap.read()
                kf_name = f"scene_{idx+1:03d}.jpg"
                kf_path = os.path.join(output_dir, kf_name)
                if ret:
                    save_cv2_frame(frame, kf_path)
                
                duration = round(end_sec - start_sec, 2)
                prompt = generate_scene_prompt(idx + 1, total_frames // step_frames + 1, duration, title, category, keyword)
                scenes_data.append({
                    "scene_index": idx + 1,
                    "start_time": f"{int(start_sec//60):02d}:{start_sec%60:04.1f}",
                    "end_time": f"{int(end_sec//60):02d}:{end_sec%60:04.1f}",
                    "start_seconds": round(start_sec, 2),
                    "end_seconds": round(end_sec, 2),
                    "duration_seconds": duration,
                    "keyframe": kf_name,
                    "keyframe_full_path": kf_path,
                    "prompt": prompt
                })
        else:
            print(f"[SCENE] Found {len(scene_list)} distinct scenes!")
            total_s = len(scene_list)
            for idx, scene in enumerate(scene_list):
                try:
                    start_frame = scene[0].frame_num
                    end_frame = scene[1].frame_num
                    start_sec = scene[0].seconds
                    end_sec = scene[1].seconds
                except AttributeError:
                    start_frame = scene[0].get_frames()
                    end_frame = scene[1].get_frames()
                    start_sec = scene[0].get_seconds()
                    end_sec = scene[1].get_seconds()
                    
                duration = round(end_sec - start_sec, 2)
                mid_frame = int((start_frame + end_frame) / 2)
                cap.set(cv2.CAP_PROP_POS_FRAMES, mid_frame)
                ret, frame = cap.read()
                kf_name = f"scene_{idx+1:03d}.jpg"
                kf_path = os.path.join(output_dir, kf_name)
                if ret:
                    save_cv2_frame(frame, kf_path)
                
                prompt = generate_scene_prompt(idx + 1, total_s, duration, title, category, keyword)
                scenes_data.append({
                    "scene_index": idx + 1,
                    "start_time": f"{int(start_sec//60):02d}:{start_sec%60:04.1f}",
                    "end_time": f"{int(end_sec//60):02d}:{end_sec%60:04.1f}",
                    "start_seconds": round(start_sec, 2),
                    "end_seconds": round(end_sec, 2),
                    "duration_seconds": duration,
                    "keyframe": kf_name,
                    "keyframe_full_path": kf_path,
                    "prompt": prompt
                })
        cap.release()
        return scenes_data
    except Exception as e:
        print(f"[SCENE ERROR] {e}, falling back to FFmpeg...")
        return extract_scenes_ffmpeg(video_path, output_dir, title, category, keyword)

def extract_scenes_ffmpeg(video_path, output_dir, title="AI Video", category="", keyword=""):
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vf", "select='gt(scene,0.25)',showinfo",
        "-vsync", "vfr",
        os.path.join(output_dir, "scene_%03d.jpg")
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    keyframes = sorted(list(Path(output_dir).glob("scene_*.jpg")))
    scenes_data = []
    total_k = len(keyframes)
    for idx, kf in enumerate(keyframes):
        prompt = generate_scene_prompt(idx + 1, total_k, 3.0, title, category, keyword)
        scenes_data.append({
            "scene_index": idx + 1,
            "keyframe": kf.name,
            "keyframe_full_path": str(kf),
            "start_time": f"00:{idx*3:02d}.0",
            "end_time": f"00:{(idx+1)*3:02d}.0",
            "duration_seconds": 3.0,
            "prompt": prompt
        })
    return scenes_data

def create_storyboard_grid(scenes, output_dir):
    try:
        keyframe_paths = [s["keyframe_full_path"] for s in scenes if os.path.exists(s.get("keyframe_full_path", ""))]
        if not keyframe_paths:
            return None, None
        images = [Image.open(p) for p in keyframe_paths]
        
        cols = min(4, len(images))
        rows = (len(images) + cols - 1) // cols
        
        w0, h0 = images[0].size
        thumb_w = 320
        thumb_h = int(thumb_w * (h0 / w0))
        
        grid_img = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (20, 20, 20))
        for idx, img in enumerate(images):
            img_resized = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            r = idx // cols
            c = idx % cols
            grid_img.paste(img_resized, (c * thumb_w, r * thumb_h))
            
        grid_name = "storyboard_contact_sheet.jpg"
        grid_path = os.path.join(output_dir, grid_name)
        grid_img.save(grid_path, quality=90)
        return grid_name, grid_path
    except Exception as e:
        print(f"[GRID ERROR] {e}")
        return None, None

def process_video_pipeline(url, target_dir=None, custom_title=None, category="", keyword=""):
    video_path, title, video_id, info = download_video(url, "downloads")
    if custom_title:
        title = custom_title
    
    if not target_dir:
        target_dir = os.path.join("03 - Viral Video Röntgenleri", f"scenes_{video_id}")
    os.makedirs(target_dir, exist_ok=True)
    
    scenes = detect_scenes_and_extract_keyframes(video_path, target_dir, title, category, keyword)
    grid_name, grid_path = create_storyboard_grid(scenes, target_dir)
    
    result = {
        "title": title,
        "video_id": video_id,
        "video_path": video_path,
        "scene_count": len(scenes),
        "scenes": scenes,
        "contact_sheet_name": grid_name,
        "contact_sheet_path": grid_path,
        "target_dir": target_dir
    }
    
    json_path = os.path.join(target_dir, "storyboard.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        
    return result

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=4agFosRTeBU"
    target = sys.argv[2] if len(sys.argv) > 2 else None
    title_arg = sys.argv[3] if len(sys.argv) > 3 else None
    category_arg = sys.argv[4] if len(sys.argv) > 4 else ""
    keyword_arg = sys.argv[5] if len(sys.argv) > 5 else ""
    
    print(f"Starting reverse engineering pipeline for: {url}")
    res = process_video_pipeline(url, target, title_arg, category_arg, keyword_arg)
    print(json.dumps({
        "status": "success",
        "scene_count": res["scene_count"],
        "scenes_dir": res["target_dir"],
        "contact_sheet": res["contact_sheet_name"]
    }, ensure_ascii=False))
