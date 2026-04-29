import { useState } from 'react';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory, type GearItem } from '../types';
import { Package, Plus, Moon, ChefHat, Shirt, Apple, Smartphone, Ellipsis, Tag, Weight, Trash2 } from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sleep: Moon,
  kitchen: ChefHat,
  clothing: Shirt,
  food: Apple,
  electronics: Smartphone,
  other: Ellipsis,
};

export default function GearLibrary() {
  const { gearItems, addGear, updateGear, deleteGear } = useStore();
  const [filter, setFilter] = useState<GearCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GearItem | null>(null);

  const filtered = filter === 'all' ? gearItems : gearItems.filter(g => g.category === filter);

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Package size={24} className="text-accent" />
          装备库
        </h1>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-2xl font-semibold text-sm shadow-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          <Plus size={16} />
          添加装备
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95 cursor-pointer ${
            filter === 'all'
              ? 'bg-accent text-white border-accent shadow-sm'
              : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
          }`}
          onClick={() => setFilter('all')}
        >
          全部 <span className="font-extrabold ml-1">{gearItems.length}</span>
        </button>
        {GEAR_CATEGORIES.map(cat => {
          const Icon = categoryIcons[cat.value];
          return (
            <button
              key={cat.value}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                filter === cat.value
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'border-slate-100 bg-surface text-slate-600 hover:bg-accent-light hover:text-accent'
              }`}
              onClick={() => setFilter(cat.value)}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          <p>{gearItems.length === 0 ? '还没有装备，添加第一条吧' : '该分类暂无装备'}</p>
        </div>
      )}

      {/* Gear grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const Icon = categoryIcons[item.category];
          return (
            <div
              key={item.id}
              className="bg-surface rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 cursor-pointer active:scale-[0.98] border-b-4 border-b-transparent hover:border-b-accent"
              onClick={() => { setEditing(item); setShowForm(true); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {Icon && <Icon size={16} className="text-accent/70" />}
                  <span className="font-extrabold text-sm">{item.name}</span>
                </div>
                <span className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-accent-light text-accent">
                  {gearCategoryLabel(item.category)}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-slate-500">
                {item.brand && (
                  <span className="inline-flex items-center gap-1"><Tag size={12} />{item.brand}</span>
                )}
                {item.weight && (
                  <span className="inline-flex items-center gap-1"><Weight size={12} />{item.weight}g</span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">×{item.quantity}</span>
              </div>
              {item.notes && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  {item.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gear Form Modal */}
      {showForm && (
        <GearForm
          initial={editing}
          onSave={(data) => {
            if (editing) {
              updateGear(editing.id, data);
            } else {
              addGear(data as any);
            }
            setShowForm(false);
            setEditing(null);
          }}
          onDelete={editing ? () => {
            if (window.confirm(`确定删除装备「${editing.name}」吗？`)) {
              deleteGear(editing.id);
              setShowForm(false);
              setEditing(null);
            }
          } : undefined}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function GearForm({ initial, onSave, onDelete, onClose }: {
  initial: GearItem | null;
  onSave: (data: Partial<GearItem>) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<GearCategory>(initial?.category ?? 'sleep');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [weight, setWeight] = useState(initial?.weight?.toString() ?? '');
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const q = Math.max(1, Math.floor(Number(quantity)) || 1);
    onSave({
      name: name.trim(),
      category,
      brand: brand.trim() || undefined,
      weight: weight ? Number(weight) : undefined,
      quantity: q,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-extrabold mb-6">{initial ? '编辑装备' : '添加装备'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">名称 *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: 黑冰G1000睡袋"
              autoFocus
              required
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">分类</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as GearCategory)}
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
              >
                {GEAR_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">数量</label>
              <input
                type="number" min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">品牌</label>
              <input
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="例: 黑冰"
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
              />
            </div>
            <div>
              <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">重量 (g)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="可选"
                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-1.5 block">备注</label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="购买日期、存放位置等"
              className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all bg-surface"
            />
          </div>
          <div className="flex items-center gap-3 mt-6">
            {onDelete && (
              <button type="button" onClick={onDelete}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red text-white rounded-2xl text-sm font-semibold hover:bg-red-700 transition-all active:scale-95 cursor-pointer">
                <Trash2 size={14} />
                删除
              </button>
            )}
            <div className="flex-1" />
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-slate-100 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
              取消
            </button>
            <button type="submit"
              className="px-5 py-2.5 bg-accent text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
