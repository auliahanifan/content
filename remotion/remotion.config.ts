import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// public/ berisi symlink (video -> folder video aktif, shared -> ../assets); lihat scripts/run.mjs
