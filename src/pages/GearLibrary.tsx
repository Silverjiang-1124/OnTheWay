import { useState } from 'react';
import { useStore } from '../store/useStore';
import { GEAR_CATEGORIES, gearCategoryLabel, type GearCategory, type GearItem } from '../types';

export default function GearLibrary() {
  const { gearItems, addGear, updateGear, deleteGear } = useStore();
  const [filter, setFilter] = useState<GearCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GearItem | null>(null);

  const filtered = filter === 'all' ? gearItems : gearItems.filter(g => g.category === filter);

  const filteredTotal = filtered.length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">装备库</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          + 添加装备
        </button>
      </div>

      <div className="filter-tabs">
        <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          全部 <span className="count">{gearItems.length}</span>
        </button>
        {GEAR_CATEGORIES.map(cat => (
          <button key={cat.value} className={`tab ${filter === cat.value ? 'active' : ''}`}
            onClick={() => setFilter(cat.value)}>
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>{gearItems.length === 0 ? '还没有装备，添加第一条吧' : '该分类暂无装备'}</p>
        </div>
      )}

      <div className="gear-grid-list">
        {filtered.map(item => (
          <div key={item.id} className="gear-card" onClick={() => { setEditing(item); setShowForm(true); }}>
            <div className="gear-card-header">
              <span className="gear-name">{item.name}</span>
              <span className="cat-tag">{gearCategoryLabel(item.category)}</span>
            </div>
            <div className="gear-card-body">
              {item.brand && <span className="gear-meta">{item.brand}</span>}
              {item.weight && <span className="gear-meta">{item.weight}g</span>}
              <span className="gear-meta">×{item.quantity}</span>
            </div>
            {item.notes && <div className="gear-notes">{item.notes}</div>}
          </div>
        ))}
      </div>

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
          onDelete={editing ? () => { deleteGear(editing.id); setShowForm(false); setEditing(null); } : undefined}
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
    onSave({
      name: name.trim(),
      category,
      brand: brand.trim() || undefined,
      weight: weight ? Number(weight) : undefined,
      quantity,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? '编辑装备' : '添加装备'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>名称 *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="例: 黑冰G1000睡袋" autoFocus required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>分类</label>
              <select value={category} onChange={e => setCategory(e.target.value as GearCategory)}>
                {GEAR_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>数量</label>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>品牌</label>
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="例: 黑冰" />
            </div>
            <div className="form-group">
              <label>重量 (g)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="可选" />
            </div>
          </div>
          <div className="form-group">
            <label>备注</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="购买日期、存放位置等" />
          </div>
          <div className="form-actions">
            {onDelete && (
              <button type="button" className="btn btn-danger" onClick={onDelete}>删除</button>
            )}
            <div style={{ flex: 1 }} />
            <button type="button" className="btn" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}
