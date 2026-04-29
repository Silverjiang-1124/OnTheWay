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

export function createQianbaPlanHtml(): string {
  return `<div class="otw-plan">
  <section class="otw-plan-hero">
    <span class="otw-plan-kicker">Lishui Longquan · Heavy Trek</span>
    <h1>千八线 · 五一重装徒步</h1>
    <p>粗坑 → 凤阳湖 → 南溪村 · 2026.04.30 晚 ~ 05.02 夜返 · 3人</p>
  </section>

  <section class="otw-plan-grid">
    <div class="otw-plan-stat"><strong>31km</strong><span>总里程</span></div>
    <div class="otw-plan-stat"><strong>3000m</strong><span>累计爬升</span></div>
    <div class="otw-plan-stat"><strong>11座</strong><span>1800m+ 山峰</span></div>
  </section>

  <section class="otw-plan-card">
    <h2>路线概览</h2>
    <p>粗坑 → 凤阳山南峰 → 绿野山庄 → 黄茅尖 1929m → 凤阳湖营地 → 烧香岩 → 天堂山 → 大天堂 → 南溪村。</p>
    <p>整体是两天重装穿越，D1 重点是高强度爬升和抵达凤阳湖扎营，D2 重点是长距离山脊推进、连续下坡和包车返程衔接。</p>
  </section>

  <section class="otw-plan-timeline">
    <article>
      <time>D0 / 04.30 周四 · 温州 → 粗坑</time>
      <h3>夜间自驾到起点，粗坑村附近扎营</h3>
      <p>19:00 温州出发，经 G1513 温丽高速、G25 长深高速、塔石互通下，约 22:30 到粗坑村口停车场。全程约 236km，过路费约 100 元。</p>
      <p>最后 21km 为山区弯道，夜间减速慢行；建议温州加满油，中途服务区解决晚饭。到达后只做轻量扎营和第二天装备复核。</p>
    </article>

    <article>
      <time>D1 / 05.01 周五 · 粗坑 → 凤阳湖</time>
      <h3>主爬升日：约 15km / 2000m+ / 9-10h</h3>
      <p>06:00 起床收帐和早餐，07:00 从粗坑出发。约 10:00 到凤阳山南峰，约 11:30 到绿野山庄补给，约 13:00 登顶黄茅尖 1929m。</p>
      <p>下午继续推进至凤阳湖，目标 16:00 左右到营地扎营做饭。凤阳湖附近有卫生间和山泉水，但仍建议过滤后饮用。</p>
    </article>

    <article>
      <time>D2 / 05.02 周六 · 凤阳湖 → 南溪村 → 温州</time>
      <h3>山脊推进与返程日：约 16km / 1000m+ / 8-9h</h3>
      <p>07:00 起床收帐并灌满全天用水，08:30 从凤阳湖出发，依次经过烧香岩、天堂山、大天堂，之后进入连续下坡段。</p>
      <p>15:30 左右到南溪村休整，16:30 包车回粗坑取车，18:30 左右开车返温州，预计 22:00 到家。下坡段建议护膝和登山杖都启用。</p>
    </article>
  </section>

  <section class="otw-plan-grid">
    <div class="otw-plan-stat"><strong>3L</strong><span>D2 每人起步水量</span></div>
    <div class="otw-plan-stat"><strong>350元</strong><span>南溪村 → 粗坑包车</span></div>
    <div class="otw-plan-stat"><strong>22:00</strong><span>预计回到温州</span></div>
  </section>

  <section class="otw-plan-alert">
    <h2>出发前确认</h2>
    <ul>
      <li>水源策略：粗坑带足起步水，绿野山庄可补，凤阳湖可取山泉；D2 从凤阳湖出发每人灌满 3L。</li>
      <li>交通衔接：南溪村包车回粗坑，联系人“大兵 18857823017”，预算 350 元/车，提前一到两天确认。</li>
      <li>风险控制：出发前复查龙泉山区天气；冲锋衣、雨衣、头灯、保暖层、离线轨迹和户外保险必须复核。</li>
      <li>装备重点：重装爬升强度高，打包时优先控制非必要物品，水、路餐、保暖和急救不要压缩。</li>
    </ul>
  </section>
</div>`;
}

export function createSeedTrip(): Trip {
  return {
    id: genId(),
    title: '千八线·五一重装徒步',
    location: '丽水龙泉',
    startDate: '2026-04-30',
    endDate: '2026-05-02',
    route: '粗坑→凤阳山→黄茅尖(1929m)→凤阳湖→烧香岩→天堂山→大天堂→南溪村',
    plan: createQianbaPlanHtml(),
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
