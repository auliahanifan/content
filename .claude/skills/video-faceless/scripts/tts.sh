#!/bin/zsh
# ElevenLabs v4 + timestamp karakter. Pakai: tts.sh <naskah-bertag.txt> <prefix-keluaran>
# env opsional: SIM (0.0-1.0, default 1.0), STAB (0.6), STYLE (0.15), MODEL (eleven_v4), LANGC (id)
# Kunci & voice id dibaca dari /Users/noice/Dev/content/.env (ELEVENLABS_API_KEY, ELEVENLABS_AULIA_RAHMAN_VOICEID).
set -e; txt=${1:?naskah}; pre=${2:?prefix}
set -a; . /Users/noice/Dev/content/.env; set +a
python3 - "$txt" > $pre.req.json <<'PY'
import json,sys,os
e=os.environ
print(json.dumps({"text":open(sys.argv[1]).read().strip(),"model_id":e.get("MODEL","eleven_v4"),
 "language_code":e.get("LANGC","id"),
 "voice_settings":{"stability":float(e.get("STAB","0.6")),"similarity_boost":float(e.get("SIM","1.0")),
  "style":float(e.get("STYLE","0.15")),"use_speaker_boost":True}}))
PY
code=$(curl -s -o $pre.resp.json -w "%{http_code}" -X POST \
 "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_AULIA_RAHMAN_VOICEID/with-timestamps?output_format=mp3_44100_128" \
 -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" -d @$pre.req.json)
echo "HTTP $code"
python3 - "$pre" <<'PY'
import json,sys,base64
p=sys.argv[1]; d=json.load(open(p+'.resp.json'))
if 'audio_base64' not in d: print(str(d)[:500]); sys.exit(1)
open(p+'.mp3','wb').write(base64.b64decode(d['audio_base64']))
json.dump(d['alignment'],open(p+'.align.json','w'))
PY
rm -f $pre.req.json $pre.resp.json
ffprobe -v error -show_entries format=duration -of csv=p=0 $pre.mp3
