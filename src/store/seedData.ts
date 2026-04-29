import type { Trip, GearItem, TripGear } from '../types';
import { genId } from '../types';

export const seedGear: GearItem[] = [
  { id: genId(), name: '云层38L背包', category: 'other', brand: 'Osprey', quantity: 1, weight: 1222, createdAt: new Date().toISOString() },
  { id: genId(), name: '飘云1帐篷', category: 'sleep', brand: '三峰出', quantity: 1, weight: 1747, createdAt: new Date().toISOString() },
  { id: genId(), name: '登山杖', category: 'other', brand: '三峰出', quantity: 2, weight: 182, createdAt: new Date().toISOString() },
  { id: genId(), name: '云岭睡袋', category: 'sleep', brand: '伯希和', quantity: 1, weight: 1300, notes: '按云岭 Primaloft 相关款估算', createdAt: new Date().toISOString() },
  { id: genId(), name: '净水瓶', category: 'kitchen', brand: '康迪', quantity: 1, weight: 59, notes: '一板', createdAt: new Date().toISOString() },
  { id: genId(), name: '3L水袋（满水）', category: 'kitchen', quantity: 1, weight: 3000, notes: '每次出发装满 3L 水，未含水袋空包自重', createdAt: new Date().toISOString() },
  { id: genId(), name: '袖套', category: 'clothing', brand: '挪客', quantity: 1, weight: 40, notes: '一副', createdAt: new Date().toISOString() },
  { id: genId(), name: '冻干粥', category: 'food', quantity: 4, weight: 40, createdAt: new Date().toISOString() },
  { id: genId(), name: '脱水蔬菜', category: 'food', quantity: 6, weight: 15, createdAt: new Date().toISOString() },
  { id: genId(), name: '洗洁精/清洁布', category: 'kitchen', brand: '迪卡侬', quantity: 1, weight: 100, createdAt: new Date().toISOString() },
  { id: genId(), name: '3合1沐浴露', category: 'other', brand: '迪卡侬', quantity: 1, weight: 250, createdAt: new Date().toISOString() },
  { id: genId(), name: '枕头', category: 'sleep', brand: '挪客', quantity: 1, weight: 110, createdAt: new Date().toISOString() },
  { id: genId(), name: '牙刷/牙膏', category: 'other', quantity: 1, weight: 30, createdAt: new Date().toISOString() },
  { id: genId(), name: 'R2.2蛋巢睡垫', category: 'sleep', brand: '牧高迪', quantity: 1, weight: 435, createdAt: new Date().toISOString() },
  { id: genId(), name: '羊毛袜', category: 'clothing', brand: 'Smartwool', quantity: 2, weight: 50, createdAt: new Date().toISOString() },
  { id: genId(), name: '速干衣', category: 'clothing', brand: '迪卡侬', quantity: 2, weight: 150, createdAt: new Date().toISOString() },
  { id: genId(), name: '羽绒服', category: 'clothing', brand: '拓路者', quantity: 1, weight: 400, createdAt: new Date().toISOString() },
  { id: genId(), name: '冲锋衣', category: 'clothing', brand: '伯希和', quantity: 1, weight: 500, createdAt: new Date().toISOString() },
  { id: genId(), name: '20000毫安充电宝', category: 'electronics', brand: '小米', quantity: 1, weight: 553, createdAt: new Date().toISOString() },
  { id: genId(), name: '急救包', category: 'other', quantity: 1, weight: 227, notes: '保温毯/碘伏/创口贴', createdAt: new Date().toISOString() },
  { id: genId(), name: '药盒', category: 'other', quantity: 1, weight: 30, notes: '8粒鱼油/3粒维生素', createdAt: new Date().toISOString() },
  { id: genId(), name: '头灯', category: 'electronics', brand: '奈特科尔', quantity: 1, weight: 50, createdAt: new Date().toISOString() },
  { id: genId(), name: '鸭舌帽', category: 'clothing', brand: '凯乐石', quantity: 1, weight: 65, createdAt: new Date().toISOString() },
  { id: genId(), name: '羊毛帽', category: 'clothing', quantity: 1, weight: 45, createdAt: new Date().toISOString() },
];

export function createSeedTrip(): Trip {
  const planHtml = `<div class="container" style="max-width:780px;margin:0 auto;font-family:-apple-system,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif;color:#2c2c2c;line-height:1.7;">
  <div style="text-align:center;padding:32px 20px 24px;background:linear-gradient(135deg,#2d5a27,#1a3a16);color:#fff;border-radius:14px;margin-bottom:16px;">
    <h1 style="font-size:22px;letter-spacing:2px;margin:0;">🏔️ 千八线·五一重装徒步</h1>
    <p style="font-size:13px;opacity:.85;margin-top:4px;">粗坑→凤阳湖→南溪村 → 包车返程 · 3人</p>
    <div style="display:flex;justify-content:center;gap:16px;margin-top:10px;font-size:12px;opacity:.75;flex-wrap:wrap;">
      <span>📅 04.30 晚 → 05.02 夜返</span>
      <span>📍 丽水·龙泉</span>
      <span>👥 3人</span>
    </div>
  </div>
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
      <div style="flex:1;min-width:80px;text-align:center;padding:8px;background:#e8f0e6;border-radius:8px;">
        <div style="font-size:20px;font-weight:700;color:#2d5a27;">~31km</div>
        <div style="font-size:12px;color:#666;">总里程</div>
      </div>
      <div style="flex:1;min-width:80px;text-align:center;padding:8px;background:#e8f0e6;border-radius:8px;">
        <div style="font-size:20px;font-weight:700;color:#2d5a27;">~3,000m</div>
        <div style="font-size:12px;color:#666;">总爬升</div>
      </div>
      <div style="flex:1;min-width:80px;text-align:center;padding:8px;background:#e8f0e6;border-radius:8px;">
        <div style="font-size:20px;font-weight:700;color:#2d5a27;">11座</div>
        <div style="font-size:12px;color:#666;">1,800m+山峰</div>
      </div>
    </div>
    <div style="font-size:17px;font-weight:700;margin-bottom:10px;">🚗 D0 · 4/30（四）温州→粗坑 <span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:10px;background:#fef0e0;color:#a86400;font-weight:600;margin-left:4px;">自驾扎营</span></div>
    <div style="font-size:14px;">
      <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 12px;">
        <span style="color:#666;">路线</span><span style="font-weight:500;">温州→G1513温丽高速→G25长深高速→塔石互通下→龙泉市区→官浦垟村粗坑</span>
        <span style="color:#666;">距离</span><span style="font-weight:500;">~236km（高速215km + 山区21km）</span>
        <span style="color:#666;">用时</span><span style="font-weight:500;"><strong>19:00→~22:30</strong>（约3.5h）</span>
        <span style="color:#666;">过路费</span><span style="font-weight:500;">~100元</span>
        <span style="color:#666;">停车</span><span style="font-weight:500;">粗坑村口停车场（凤阳山缆车下站）</span>
        <span style="color:#666;">扎营</span><span style="font-weight:500;">粗坑村附近平地扎帐</span>
      </div>
    </div>
    <div style="background:#fff8e6;border-left:4px solid #e6a817;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;margin-top:10px;">
      ⚠️ 最后21km山区弯道，夜间减速慢行。建议温州加满油，中途服务区吃晚饭。
    </div>
  </div>
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
    <div style="font-size:17px;font-weight:700;margin-bottom:10px;">🥾 D1 · 5/1（五）粗坑→凤阳湖 <span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:10px;background:#e8f0e6;color:#2d5a27;font-weight:600;margin-left:4px;">硬仗日</span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~15km</div><div style="font-size:11px;color:#666;">里程</div></div>
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~2,000m</div><div style="font-size:11px;color:#666;">爬升</div></div>
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~9-10h</div><div style="font-size:11px;color:#666;">用时</div></div>
    </div>
    <div style="font-size:13.5px;">
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">06:00</span><span>起床收帐、早餐</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">07:00</span><span>粗坑出发 ↑</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~10:00</span><span>凤阳山南峰（1848m）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~11:30</span><span>🌟 绿野山庄（唯一补给点）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~13:00</span><span>🏁 <strong>黄茅尖 1929m</strong>（浙江之巅）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~16:00</span><span>🏕️ <strong>凤阳湖营地</strong>（扎营、做饭）</span></div>
    </div>
    <div style="background:#e8f0e6;border-left:4px solid #2d5a27;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;margin-top:10px;">
      📍 凤阳湖边扎营，有卫生间、山泉水（需过滤）。粗坑带足水→绿野山庄可补→凤阳湖有泉水。
    </div>
  </div>
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
    <div style="font-size:17px;font-weight:700;margin-bottom:10px;">🥾 D2 · 5/2（六）凤阳湖→南溪村→包车回温州 <span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:10px;background:#fef0e0;color:#a86400;font-weight:600;margin-left:4px;">当夜返程</span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~16km</div><div style="font-size:11px;color:#666;">徒步</div></div>
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~1,000m</div><div style="font-size:11px;color:#666;">爬升</div></div>
      <div style="flex:1;min-width:70px;text-align:center;padding:6px;background:#e8f0e6;border-radius:8px;"><div style="font-size:18px;font-weight:700;color:#2d5a27;">~8-9h</div><div style="font-size:11px;color:#666;">徒步用时</div></div>
    </div>
    <div style="font-size:13.5px;">
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">07:00</span><span>起床收帐、灌满全天用水</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">08:30</span><span>凤阳湖出发 → 烧香岩</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~10:00</span><span>烧香岩（1832m）山脊线</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~11:30</span><span>天堂山→大天堂（1822m）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~13:00</span><span>连续下坡（戴护膝）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~15:30</span><span>🏁 到达南溪村，休息吃饭</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~16:30</span><span>🚐 <strong>包车回粗坑</strong>（1.5-2h）</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f3f3f3;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~18:30</span><span>🚗 到粗坑取车，开回温州</span></div>
      <div style="display:flex;gap:8px;padding:4px 0;"><span style="width:55px;flex-shrink:0;font-weight:600;color:#2d5a27;">~22:00</span><span>🏠 到温州</span></div>
    </div>
    <div style="background:#e8f0e6;border-left:4px solid #2d5a27;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;margin-top:10px;">
      💧 凤阳湖出发每人灌满≥3L，全天无补给，南溪村有泉水。<br>
      🚐 <strong>包车：大兵 18857823017（微信531017）</strong> 350元/车。提前一两天联系。
    </div>
  </div>
  <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
    <div style="font-size:17px;font-weight:700;margin-bottom:10px;">🌤 天气预报 <span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:10px;background:#e3edf7;color:#1a5276;font-weight:600;margin-left:4px;">龙泉山区·4/28查询</span></div>
    <p style="font-size:13px;color:#666;margin-bottom:8px;">不同预报源存在分歧，出发前再确认。</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr><th style="text-align:left;padding:6px 8px;background:#f0ede6;font-size:12px;">日期</th><th style="text-align:left;padding:6px 8px;background:#f0ede6;font-size:12px;">中国天气网</th><th style="text-align:left;padding:6px 8px;background:#f0ede6;font-size:12px;">yzqxj</th><th style="text-align:left;padding:6px 8px;background:#f0ede6;font-size:12px;">气温</th></tr></thead>
      <tbody>
        <tr><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;"><strong>4/30晚</strong></td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">—</td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">晴</td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">~10-15°C</td></tr>
        <tr><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;"><strong>5/1</strong></td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">阴 12~22°C</td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">晴/多云 11~28°C</td><td style="padding:5px 8px;border-bottom:1px solid #f0f0f0;">分歧较大</td></tr>
        <tr><td style="padding:5px 8px;"><strong>5/2</strong></td><td style="padding:5px 8px;">阴 12~20°C</td><td style="padding:5px 8px;">多云转小雨 15~29°C</td><td style="padding:5px 8px;">不确定</td></tr>
      </tbody>
    </table>
    <div style="background:#fff8e6;border-left:4px solid #e6a817;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;margin-top:10px;">
      出发前刷「中国天气网」龙泉站或彩云天气。冲锋衣+雨衣都带，山里小气候说不准。
    </div>
  </div>
  <div style="text-align:center;padding:16px 0 8px;font-size:11px;color:#666;">2026.04.28 整理</div>
</div>`;

  return {
    id: genId(),
    title: '千八线·五一重装徒步',
    location: '丽水龙泉',
    startDate: '2026-04-30',
    endDate: '2026-05-02',
    route: '粗坑→凤阳山→黄茅尖(1929m)→凤阳湖→烧香岩→天堂山→大天堂→南溪村',
    plan: planHtml,
    trackUrl: 'https://www.2bulu.com/track/t-JSONPxWwVJzp%25253D.htm',
    distance: 31,
    elevation: 3000,
    members: ['我', '队友'],
    gearList: seedGear.map(g => ({ gearId: g.id, packed: false }) as TripGear),
    status: 'planned',
    journal: '出发前准备：\n· 包车已联系大兵（18857823017），南溪村→粗坑 350元\n· 龙泉买气罐×3\n· 两步路已下载离线轨迹\n· 户外保险已买\n—\n记录回来后补写 ✍️',
    rating: undefined,
    createdAt: new Date('2026-04-28').toISOString(),
  };
}
