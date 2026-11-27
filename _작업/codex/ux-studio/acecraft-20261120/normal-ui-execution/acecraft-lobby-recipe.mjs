const b='/ui-studio/source/assets/import-staging/acecraft-20261120/';
const fr=s=>b+'acecraft_common_'+s+'_normal_v001.png';
const a=[];const r=(x,y,w,h)=>({x,y,w,h});
const add=(key,op,name,rect,extra={})=>a.push({key,op,name,rect,...extra});
const text=(key,txt,rect,size=14,color='#493329',parent,weight=700)=>add(key,'text','Txt_ACE_Lobby_'+key,rect,{text:txt,size,color,weight,parent,align:'center'});
const group=(key,rect)=>add(key,'plain','Panel_ACE_Lobby_'+key,rect,{role:'frame',fill:'#ffffff'});
const img=(key,file,rect,parent,region)=>add(key,'image','Img_ACE_Lobby_'+key,rect,{path:b+file,parent,region});
const glyph=(key,n,rect,parent)=>img(key,'acecraft_resource_glyph_atlas4x3_normal_v001.png',rect,parent,[(n%4)*64,Math.floor(n/4)*64,64,64]);
const button=(key,label,rect,parent,blue=false,size=13)=>add(key,'button','Btn_ACE_Lobby_'+key,rect,{text:label,size,color:'#493329',skin:fr((blue?'blue':'yellow')+'cta3'),skinMetrics:[0,18,0,18],parent});
img('Scene','acecraft-lobby-background-v001.webp',r(0,0,420,924));
group('HUD',r(8,38,404,74));
add('Profile','panel','Panel_ACE_Lobby_Profile',r(8,43,191,55),{skin:fr('paper9'),skinMetrics:[20,20,20,20],parent:'HUD'});
glyph('ProfileIcon',9,r(15,47,44,44),'Profile');text('Name','SamplePilot',r(62,48,130,21),15,'#493329','Profile');text('Level','Lv. 43',r(62,70,90,18),12,'#876843','Profile');
for(let [key,n,txt,x]of[['Energy',2,'237/60',208],['Gems',1,'4,209',278],['Coins',0,'8,012',345]]){glyph(key+'Icon',n,r(x,47,24,24),'HUD');text(key,txt,r(x-5,76,72,21),12,'#493329','HUD');}
add('Pass','panel','Panel_ACE_Lobby_NavigatorPass',r(119,211,188,100),{skin:fr('paper9'),skinMetrics:[20,20,20,20]});
text('PassTitle','NAVIGATOR PASS',r(130,223,166,27),17,'#493329','Pass');text('PassProgress','0 / 100',r(142,265,142,25),18,'#493329','Pass');
img('Mascot','acecraft-lobby-mascot-proposal-v001.webp',r(119,298,183,399),null,[75,0,350,768]);
for(let [key,label,n,x,y]of[['Store','Store',3,9,155],['FirstPurchase','First\nPurchase',5,9,226],['Privileges','Privileges',0,9,297],['SpecialRecruit','Special\nRecruit',3,9,368],['RadiantPact','Radiant\nPact',6,9,439],['Menu','Menu',10,353,155],['FlightLog','Flight Log',8,353,226],['Patrol','Patrol',7,353,297],['Events','Events',2,353,368],['MysticVisit','Mystic Visit',4,353,439],['Recruit','Recruit',3,353,510]]){add(key,'button','Btn_ACE_Lobby_'+key,r(x,y,58,65),{text:'',transparent:true});glyph(key+'Glyph',n,r(x+10,y,38,38),key);text(key+'Label',label,r(x,y+38,58,27),10,'#493329',key);}
text('Period','New Period Begins · Limited-Time',r(116,701,200,24),12,'#493329');
button('Start','Start',r(95,766,230,55),null,false,26);
text('Trial','Realm Trial',r(5,790,84,26),11);text('Apple','Golden Apple',r(330,790,85,26),11);
group('BottomNav',r(0,852,420,72));
for(let [i,k,l,n]of[[0,'Pilots','Pilots',9],[1,'RecruitNav','Recruit',3],[2,'Adventure','Adventure',2],[3,'Shop','Shop',7],[4,'PassNav','Pass',4]]){add(k,'button','Btn_ACE_Lobby_'+k,r(i*84,852,84,72),{text:'',transparent:true,parent:'BottomNav'});glyph(k+'Glyph',n,r(i*84+22,857,40,40),k);text(k+'Label',l,r(i*84+2,899,80,20),12,'#493329',k);}
export default {kind:'normal-ui-action-recipes-not-design',id:'ACE01',name:'Page_ACE_Lobby',nativeKind:'page',purpose:'영상A7초의 로비 고정HUD/중앙캐릭터/양옆퀵메뉴/5개하단탭. 새그림과 native텍스트 분리. 원본캐릭터와복장차이 및glyph대체는자료표참조.',actions:a};
