# -*- coding: utf-8 -*-
from pathlib import Path
import importlib.util,json
p=Path(__file__).with_name('prepare_assets.py');spec=importlib.util.spec_from_file_location('art',p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
for c in ['green','orange']:
 for v in ['normal','pressed']:m.make('main-'+c+'-'+v,(214,100),lambda im,d,w,h,c=c,v=v:m.btn(im,d,w,h,v=='pressed',c))
a=Path(__file__).with_name('assets.json');a.write_text(json.dumps({'assets':m.assets},ensure_ascii=False,indent=2));print('main variants',len(m.assets))
