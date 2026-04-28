import type { GearItem, Trip } from '../types';
import { genId } from '../types';

const now = new Date('2026-04-28').toISOString();

let gid = 0;
const g = () => genId();

export const seedGear: GearItem[] = [
  // 睡眠系统
  { id: g(), name: '双人帐', category: 'sleep', brand: '三峰出飘云', weight: 2200, quantity: 1, notes: '含地布、地钉、风绳', createdAt: now },
  { id: g(), name: '单人帐', category: 'sleep', brand: '三峰出蓝山', weight: 1400, quantity: 1, notes: '备用', createdAt: now },
  { id: g(), name: '睡袋', category: 'sleep', brand: '黑冰G1000', weight: 1350, quantity: 1, notes: '舒适温标-5°C', createdAt: now },
  { id: g(), name: '睡袋', category: 'sleep', brand: '黑冰G700', weight: 1050, quantity: 1, notes: '舒适温标0°C', createdAt: now },
  { id: g(), name: '睡袋', category: 'sleep', weight: 1200, quantity: 1, notes: '', createdAt: now },
  { id: g(), name: '充气睡垫', category: 'sleep', brand: '挪客', weight: 550, quantity: 1, notes: '', createdAt: now },
  { id: g(), name: '蛋巢睡垫', category: 'sleep', weight: 350, quantity: 1, notes: '防刺穿备用', createdAt: now },
  { id: g(), name: '睡垫', category: 'sleep', weight: 500, quantity: 1, notes: '', createdAt: now },
  { id: g(), name: '充气枕', category: 'sleep', weight: 80, quantity: 3, notes: '', createdAt: now },

  // 饮食系统
  { id: g(), name: '炉头', category: 'kitchen', brand: '火枫FMS-116T', weight: 80, quantity: 1, notes: '', createdAt: now },
  { id: g(), name: '套锅', category: 'kitchen', weight: 300, quantity: 1, notes: '含2人锅+煎盘', createdAt: now },
  { id: g(), name: '气罐', category: 'kitchen', weight: 250, quantity: 3, notes: '龙泉市区买，G2', createdAt: now },
  { id: g(), name: '净水器', category: 'kitchen', brand: '康迪', weight: 60, quantity: 1, notes: '山泉水过滤用', createdAt: now },
  { id: g(), name: '水袋 3L', category: 'kitchen', weight: 150, quantity: 3, notes: '每人一个', createdAt: now },
  { id: g(), name: '保温杯 500ml', category: 'kitchen', weight: 300, quantity: 3, notes: '每人一个，营地喝热水', createdAt: now },
  { id: g(), name: '餐具套装', category: 'kitchen', weight: 100, quantity: 3, notes: '碗+筷+勺', createdAt: now },
  { id: g(), name: '打火机', category: 'kitchen', weight: 10, quantity: 2, notes: '防水袋装好', createdAt: now },
  { id: g(), name: '折叠水桶', category: 'kitchen', weight: 40, quantity: 1, notes: '营地打水', createdAt: now },
  { id: g(), name: '防风板', category: 'kitchen', weight: 60, quantity: 1, notes: '', createdAt: now },

  // 衣物
  { id: g(), name: '速干衣裤', category: 'clothing', brand: '凯乐石', weight: 250, quantity: 3, notes: '每人一套穿一套备用', createdAt: now },
  { id: g(), name: '抓绒衣', category: 'clothing', brand: '迪卡侬', weight: 350, quantity: 3, notes: '中间保暖层', createdAt: now },
  { id: g(), name: '薄羽绒服', category: 'clothing', brand: '黑冰', weight: 350, quantity: 3, notes: '营地静态保暖', createdAt: now },
  { id: g(), name: '冲锋衣', category: 'clothing', brand: '凯乐石', weight: 500, quantity: 3, notes: '防风防水', createdAt: now },
  { id: g(), name: '冲锋裤', category: 'clothing', brand: '凯乐石', weight: 400, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '分体雨衣', category: 'clothing', weight: 300, quantity: 3, notes: 'D2可能下雨', createdAt: now },
  { id: g(), name: '高帮防水登山鞋', category: 'clothing', brand: 'Scarpa', weight: 600, quantity: 3, notes: 'Vibram底', createdAt: now },
  { id: g(), name: '遮阳帽', category: 'clothing', weight: 50, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '保暖帽', category: 'clothing', weight: 40, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '防刮手套', category: 'clothing', weight: 50, quantity: 3, notes: '密林路段', createdAt: now },
  { id: g(), name: '保暖手套', category: 'clothing', weight: 80, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '徒步袜', category: 'clothing', brand: '羊毛袜', weight: 40, quantity: 6, notes: '每人2-3双', createdAt: now },
  { id: g(), name: '魔术头巾', category: 'clothing', weight: 20, quantity: 3, notes: '防晒防风防树枝', createdAt: now },

  // 路餐补给
  { id: g(), name: '能量胶', category: 'food', weight: 30, quantity: 24, notes: '每人6-8条', createdAt: now },
  { id: g(), name: '坚果混合果干', category: 'food', weight: 200, quantity: 3, notes: '每人一袋', createdAt: now },
  { id: g(), name: '牛肉干', category: 'food', weight: 150, quantity: 3, notes: '咸味补给', createdAt: now },
  { id: g(), name: '士力架', category: 'food', weight: 50, quantity: 12, notes: '高热量', createdAt: now },
  { id: g(), name: '压缩饼干', category: 'food', weight: 100, quantity: 6, notes: '每人2块，应急备用', createdAt: now },
  { id: g(), name: '电解质粉', category: 'food', weight: 10, quantity: 24, notes: '每人6-8条兑水喝', createdAt: now },
  { id: g(), name: '大米', category: 'food', weight: 500, quantity: 1, notes: '2天晚餐', createdAt: now },
  { id: g(), name: '面条', category: 'food', weight: 300, quantity: 1, notes: '2天早餐', createdAt: now },
  { id: g(), name: '腊肠', category: 'food', weight: 200, quantity: 1, notes: '配餐', createdAt: now },
  { id: g(), name: '脱水蔬菜', category: 'food', weight: 80, quantity: 1, notes: '', createdAt: now },
  { id: g(), name: '汤料', category: 'food', weight: 50, quantity: 6, notes: '晚饭喝汤', createdAt: now },

  // 电子设备
  { id: g(), name: '头灯', category: 'electronics', weight: 80, quantity: 3, notes: '含备用电池，D0扎营+夜路', createdAt: now },
  { id: g(), name: '充电宝 20000mAh', category: 'electronics', weight: 350, quantity: 2, notes: '', createdAt: now },
  { id: g(), name: '手机', category: 'electronics', weight: 200, quantity: 3, notes: '提前下载两步路离线轨迹', createdAt: now },

  // 其他
  { id: g(), name: '重装包 65L', category: 'other', brand: 'Osprey', weight: 2200, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '背包防水罩', category: 'other', weight: 100, quantity: 3, notes: '', createdAt: now },
  { id: g(), name: '登山杖', category: 'other', brand: 'BD', weight: 250, quantity: 6, notes: '每人两根！', createdAt: now },
  { id: g(), name: '护膝', category: 'other', weight: 100, quantity: 3, notes: '下坡多，必带', createdAt: now },
  { id: g(), name: '急救包', category: 'other', weight: 200, quantity: 1, notes: '碘伏/创口贴/止痛药/盐丸/藿香正气', createdAt: now },
  { id: g(), name: '急救毯', category: 'other', weight: 40, quantity: 3, notes: '失温防护', createdAt: now },
  { id: g(), name: '防晒霜', category: 'other', weight: 50, quantity: 1, notes: 'SPF50+', createdAt: now },
  { id: g(), name: '垃圾袋', category: 'other', weight: 20, quantity: 5, notes: '所有垃圾背下山', createdAt: now },
];

export function createSeedTrip(gearList: GearItem[]): Trip {
  const planHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>千八线·五一重装徒步计划</title>
<style>
  :root {
    --bg: #f7f5f0;
    --card: #ffffff;
    --accent: #2d5a27;
    --accent-light: #e8f0e6;
    --text: #2c2c2c;
    --text-secondary: #666;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    padding: 24px;
  }
  .container { max-width: 780px; margin: 0 auto; }
  .header { text-align:center; padding:40px 24px 28px; background:linear-gradient(135deg,#2d5a27,#1a3a16); color:#fff; border-radius:14px; margin-bottom:20px; }
  .header h1 { font-size:26px; font-weight:700; letter-spacing:2px; }
  .header .sub { font-size:14px; opacity:.85; margin-top:6px; }
  .header .meta { display:flex; justify-content:center; gap:20px; margin-top:14px; font-size:13px; opacity:.75; flex-wrap:wrap; }
  .card { background:#fff; border-radius:12px; padding:22px 26px; margin-bottom:16px; box-shadow:0 1px 4px rgba(0,0,0,.06); }
  .card-title { font-size:17px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .profile { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:14px; }
  .profile-item { flex:1; min-width:90px; text-align:center; padding:10px 8px; background:#e8f0e6; border-radius:8px; }
  .profile-item .num { font-size:20px; font-weight:700; color:#2d5a27; }
  .profile-item .lbl { font-size:12px; color:#666; margin-top:2px; }
  .info-grid { display:grid; grid-template-columns:auto 1fr; gap:4px 14px; font-size:14px; }
  .info-grid .lbl { color:#666; white-space:nowrap; }
  .info-grid .val { font-weight:500; }
  .timeline { margin:10px 0 4px; }
  .tl-row { display:flex; gap:10px; padding:5px 0; font-size:13.5px; border-bottom:1px solid #f3f3f3; }
  .tl-row:last-child { border-bottom:none; }
  .tl-time { width:60px; flex-shrink:0; font-weight:600; color:#2d5a27; }
  .w-table { width:100%; border-collapse:collapse; font-size:14px; margin-top:6px; }
  .w-table th { text-align:left; padding:7px 10px; background:#f0ede6; font-weight:600; font-size:13px; }
  .w-table td { padding:7px 10px; border-bottom:1px solid #f0f0f0; }
  .tag { display:inline-block; font-size:11px; padding:1px 8px; border-radius:10px; font-weight:600; margin-left:4px; }
  .tag-green { background:#e8f0e6; color:#2d5a27; }
  .tag-orange { background:#fef0e0; color:#a86400; }
  .tag-blue { background:#e3edf7; color:#1a5276; }
  .note { background:#fff8e6; border-left:4px solid #e6a817; padding:10px 14px; border-radius:0 6px 6px 0; font-size:13.5px; margin-top:10px; }
  .note-safe { background:#e8f0e6; border-left-color:#2d5a27; }
  .compact-list { font-size:13.5px; list-style:none; }
  .compact-list li { margin-bottom:3px; }
  .compact-list li::before { content:"· "; color:#2d5a27; font-weight:700; }
  hr { border:none; border-top:1px solid #e8e4dc; margin:16px 0; }
  @media (max-width:640px) {
    body { padding:12px; }
    .header { padding:28px 16px 20px; }
    .header h1 { font-size:20px; }
    .card { padding:16px; }
    .info-grid { grid-template-columns:1fr; gap:2px; }
    .tl-time { width:50px; }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🏔️ 千八线·五一重装徒步</h1>
    <p class="sub">粗坑→凤阳湖→南溪村 → 包车返程 · 3人</p>
    <div class="meta">
      <span>📅 04.30 晚 → 05.02 夜返</span>
      <span>📍 丽水·龙泉</span>
      <span>👥 3人</span>
    </div>
  </div>
  <div class="card">
    <div class="card-title">🚗 D0 · 4/30（四）温州→粗坑 <span class="tag tag-orange">自驾扎营</span></div>
    <div class="info-grid">
      <span class="lbl">路线</span>
      <span class="val">温州 → G1513温丽高速 → G25长深高速 → 塔石互通下 → 龙泉市区 → 官浦垟村粗坑</span>
      <span class="lbl">距离</span><span class="val">~236km（高速215km + 山区公路21km）</span>
      <span class="lbl">用时</span><span class="val"><strong>19:00→~22:30</strong>（约3.5h）</span>
      <span class="lbl">过路费</span><span class="val">~100元</span>
      <span class="lbl">停车</span><span class="val">粗坑村口停车场（凤阳山缆车下站）</span>
      <span class="lbl">扎营</span><span class="val">粗坑村附近平地扎帐，或住美福民宿</span>
    </div>
    <div class="note"><strong>⚠️ 最后21km山区弯道，夜间减速慢行。</strong> 建议温州加满油，中途服务区吃晚饭。</div>
  </div>
  <div class="card">
    <div class="card-title">🥾 D1 · 5/1（五）粗坑→凤阳湖 <span class="tag tag-green">硬仗日</span></div>
    <div class="profile">
      <div class="profile-item"><div class="num">~15km</div><div class="lbl">里程</div></div>
      <div class="profile-item"><div class="num">~2,000m</div><div class="lbl">爬升</div></div>
      <div class="profile-item"><div class="num">~9-10h</div><div class="lbl">用时</div></div>
    </div>
    <div class="timeline">
      <div class="tl-row"><span class="tl-time">06:00</span><span>起床收帐、早餐</span></div>
      <div class="tl-row"><span class="tl-time">07:00</span><span>粗坑出发 ↑</span></div>
      <div class="tl-row"><span class="tl-time">~10:00</span><span>凤阳山南峰（1848m）</span></div>
      <div class="tl-row"><span class="tl-time">~11:30</span><span>🌟 绿野山庄（唯一补给点）</span></div>
      <div class="tl-row"><span class="tl-time">~13:00</span><span>🏁 <strong>黄茅尖 1929m</strong>（浙江之巅）</span></div>
      <div class="tl-row"><span class="tl-time">~16:00</span><span>🏕️ <strong>凤阳湖营地</strong>（扎营、做饭）</span></div>
    </div>
    <div class="note-safe"><strong>📍 营地：</strong>凤阳湖边扎营，有卫生间、山泉水（需过滤）。<br><strong>💧 水源：</strong>粗坑出发带足水 → 绿野山庄可补 → 凤阳湖有泉水。</div>
  </div>
  <div class="card">
    <div class="card-title">🥾 D2 · 5/2（六）凤阳湖→南溪村→包车回粗坑→开回温州 <span class="tag tag-orange">当夜返程</span></div>
    <div class="profile">
      <div class="profile-item"><div class="num">~16km</div><div class="lbl">徒步</div></div>
      <div class="profile-item"><div class="num">~1,000m</div><div class="lbl">爬升</div></div>
      <div class="profile-item"><div class="num">~8-9h</div><div class="lbl">用时</div></div>
    </div>
    <div class="timeline">
      <div class="tl-row"><span class="tl-time">07:00</span><span>起床收帐、灌满全天用水</span></div>
      <div class="tl-row"><span class="tl-time">08:30</span><span>凤阳湖出发 → 烧香岩</span></div>
      <div class="tl-row"><span class="tl-time">~10:00</span><span>烧香岩（1832m）山脊线</span></div>
      <div class="tl-row"><span class="tl-time">~11:30</span><span>天堂山→大天堂（1822m）</span></div>
      <div class="tl-row"><span class="tl-time">~13:00</span><span>连续下坡（戴护膝）</span></div>
      <div class="tl-row"><span class="tl-time">~15:30</span><span>🏁 到达南溪村，休息吃饭</span></div>
      <div class="tl-row"><span class="tl-time">~16:30</span><span>🚐 <strong>包车回粗坑</strong>（50-70km / 1.5-2h）</span></div>
      <div class="tl-row"><span class="tl-time">~18:30</span><span>🚗 到粗坑取车，出发回温州</span></div>
      <div class="tl-row"><span class="tl-time">~22:00</span><span>🏠 到温州</span></div>
    </div>
    <div class="note-safe">
      <strong>💧 水源：</strong>凤阳湖出发每人灌满≥3L，全天无补给，南溪村有泉水。<br>
      <strong>🚐 包车：</strong>南溪村→粗坑公路约1.5-2h。<strong>大兵 18857823017（微信531017）</strong> 350元/车。提前一两天联系约好时间。
    </div>
  </div>
  <div class="card">
    <div class="card-title">🌤 天气预报 <span class="tag tag-blue">龙泉山区·4/28查询</span></div>
    <p style="font-size:13px;color:#666;margin-bottom:10px;">不同预报源存在分歧，出发前再确认一次。</p>
    <table class="w-table">
      <thead><tr><th>日期</th><th>中国天气网</th><th>yzqxj / ip.cn</th><th>气温</th></tr></thead>
      <tbody>
        <tr><td><strong>4/30 晚</strong></td><td>—</td><td>晴</td><td>~10-15°C</td></tr>
        <tr><td><strong>5/1</strong></td><td>阴 12~22°C</td><td>晴/多云 11~28°C</td><td>分歧较大</td></tr>
        <tr><td><strong>5/2</strong></td><td>阴 12~20°C</td><td>多云转小雨 15~29°C</td><td>看情况</td></tr>
        <tr><td><strong>5/3</strong></td><td>—</td><td>多云转中雨 16~24°C</td><td>返程日</td></tr>
      </tbody>
    </table>
    <div class="note"><strong>📌 现在看5/1大概率不下雨，</strong>出发前再刷一下「中国天气网」龙泉站或「彩云天气」。冲锋衣+雨衣都带着，山里小气候说不准。</div>
  </div>
  <div style="text-align:center;padding:20px 0 10px;font-size:12px;color:#666;">2026.04.28 整理 · 出发前请复核天气预报</div>
</div>
</body>
</html>`;

  return {
    id: genId(),
    title: '千八线·五一重装徒步',
    location: '丽水龙泉',
    startDate: '2026-04-30',
    endDate: '2026-05-02',
    route: '粗坑→凤阳山→黄茅尖(1929m)→凤阳湖→烧香岩→天堂山→大天堂→南溪村',
    plan: planHtml,
    distance: 31,
    elevation: 3000,
    members: ['我'],
    gearList: gearList.map(g => ({ gearId: g.id, packed: false })),
    status: 'planned',
    journal: '出发前准备：\n· 包车已联系大兵（18857823017），南溪村→粗坑 350元\n· 龙泉买气罐×3\n· 两步路已下载离线轨迹\n· 户外保险已买\n—\n记录回来后补写 ✍️',
    rating: undefined,
    createdAt: now,
  };
}
