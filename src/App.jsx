import React, { useState, useRef, useEffect } from 'react';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;
const BUTTON_SIZE = 120;
const BUTTON_AREA_PADDING = 30;
const TOP_MEMO_HEIGHT = 160;
const BOTTOM_MEMO_HEIGHT = 80;
const TOP_BANNER_HEIGHT = 150;          // 裏面の一番上の画像の高さ(固定)

const BACK_MIDDLE_IMG_MIN_HEIGHT = 200; // 裏面の中段画像の最小の高さ

// ============================================================
// テスト用画像コンポーネント
// ============================================================
function TestImage({ width, height, label, bgColor, fgColor }) {
  const fontMain = Math.max(24, Math.min(width, height) * 0.06);
  const fontSub = Math.max(20, Math.min(width, height) * 0.05);
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: bgColor,
      color: fgColor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      border: `6px solid ${fgColor}`,
      boxSizing: 'border-box',
      flexShrink: 0,
      position: 'relative',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}>
      <div style={{ fontSize: `${fontMain}px`, fontWeight: 'bold', textAlign: 'center', padding: '0 20px' }}>{label}</div>
      <div style={{ fontSize: `${fontSub}px`, marginTop: '20px' }}>{width} x {height} px</div>
      <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', backgroundColor: fgColor, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', backgroundColor: fgColor, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '40px', height: '40px', backgroundColor: fgColor, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', backgroundColor: fgColor, borderRadius: '50%' }} />
    </div>
  );
}

// ============================================================
// メニュー内の見出しバナー画像
//   - 作成者がデザインを入れる用。利用者は変更不可
//   - src を渡すと <img> として表示
//   - src 未指定ならプレースホルダー表示(後でURL差し替え可能)
// ============================================================
function HeaderImage({ src, alt, height = 40, label, bgColor = '#9ca3af', fgColor = '#1f2937' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || label || ''}
        style={{
          display: 'block',
          width: '100%',
          height: `${height}px`,
          objectFit: 'cover',
          borderRadius: '6px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        draggable={false}
      />
    );
  }
  // プレースホルダー(画像未設定時)
  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      backgroundColor: bgColor,
      color: fgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      border: `2px dashed ${fgColor}`,
      boxSizing: 'border-box',
      fontSize: '13px',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}>
      {label || 'バナー画像(未設定)'}
    </div>
  );
}

// ============================================================
// カード内の画像表示
//   - imageUrl があれば <img> で実画像を表示
//   - なければ TestImage(プレースホルダー)を表示
// ============================================================
function CardImage({ imageUrl, width, height, label, bgColor, fgColor, preserveAspectRatio = false }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label || ''}
        style={{
          display: 'block',
          width: preserveAspectRatio ? '100%' : `${width}px`,
          height: preserveAspectRatio ? 'auto' : `${height}px`,
          maxWidth: `${width}px`,
          objectFit: preserveAspectRatio ? 'contain' : 'cover',
          flexShrink: 0,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        draggable={false}
      />
    );
  }
  return (
    <TestImage
      width={width}
      height={height}
      label={label}
      bgColor={bgColor}
      fgColor={fgColor}
    />
  );
}

// ============================================================
// カード設定
//   - 画像URLは命名規則から自動生成
//   - 画像ファイル名: card{id}-front.png / card{id}-banner.png / card{id}-mid.png
//   - 配置先: GitHub Pages (https://danispanish.github.io/FlashCard/)
//   - backMidHeight: 裏面の中段画像の高さ(画像のサイズに合わせて指定)
// ============================================================
const IMAGE_BASE_URL = 'https://danispanish.github.io/FlashCard/';

// カードの基本設定(編集する場所)
const CARD_DEFINITIONS = [
  { id: 1,  title: '種類変更',   backMidHeight: 297 },
  { id: 2,  title: '',           backMidHeight: 393 },
  { id: 3,  title: '',           backMidHeight: 393 },
  { id: 4,  title: '',           backMidHeight: 393 },
  { id: 5,  title: '',           backMidHeight: 393 },
  { id: 6,  title: '',           backMidHeight: 393 },
  { id: 7,  title: '',           backMidHeight: 393 },
  { id: 8,  title: '',           backMidHeight: 393 },
  { id: 9,  title: '',           backMidHeight: 393 },
  { id: 10, title: '',           backMidHeight: 393 },
  { id: 11, title: '',           backMidHeight: 393 },
  { id: 12, title: '',           backMidHeight: 393 },
  { id: 13, title: '',           backMidHeight: 393 },
  { id: 14, title: '',           backMidHeight: 393 },
  { id: 15, title: '',           backMidHeight: 393 },
  { id: 16, title: '',           backMidHeight: 393 },
  { id: 17, title: '',           backMidHeight: 393 },
  { id: 18, title: '',           backMidHeight: 393 },
  { id: 19, title: '',           backMidHeight: 393 },
  { id: 20, title: '',           backMidHeight: 393 },
  { id: 21, title: '',           backMidHeight: 393 },
  { id: 22, title: '',           backMidHeight: 393 },
  { id: 23, title: '',           backMidHeight: 393 },
  { id: 24, title: '',           backMidHeight: 393 },
  { id: 25, title: '',           backMidHeight: 393 },
  { id: 26, title: '',           backMidHeight: 393 },
];

// カードIDから画像URLを生成
function getCardImageUrl(cardId, type) {
  return `${IMAGE_BASE_URL}card${cardId}-${type}.png`;
}

// 基本設定を、フラッシュカードシステムが使う形式に変換
function buildCardData(card) {
  return {
    id: card.id,
    title: card.title || '',
    isCover: false,
    front: {
      label: `Card ${card.id} Front`,
      bgColor: '#FFE4B5',
      fgColor: '#8B4513',
      imageUrl: getCardImageUrl(card.id, 'front'),
    },
    backTop: {
      label: `Card ${card.id} Top Banner`,
      bgColor: '#E0F7FA',
      fgColor: '#00695C',
      imageUrl: getCardImageUrl(card.id, 'banner'),
    },
    backMid: {
      height: card.backMidHeight || 393,
      label: `Card ${card.id} Back Mid`,
      bgColor: '#E6E6FA',
      fgColor: '#4B0082',
      imageUrl: getCardImageUrl(card.id, 'mid'),
    },
  };
}

// 表紙ページ(片面のみ)
const COVER_CARD = {
  id: 'cover',
  title: '表紙',
  isCover: true,
  front: {
    label: 'Cover',
    bgColor: '#FFFFFF',
    fgColor: '#333333',
    imageUrl: `${IMAGE_BASE_URL}cover.png`,
  },
};

// 実際に使う展開済みのカードデータ(先頭に表紙を追加)
const CARDS = [COVER_CARD, ...CARD_DEFINITIONS.map(buildCardData)];

// ============================================================
// 4色切替ボタン
// ============================================================
const BUTTON_COLORS = ['#cccccc', '#93baea', '#fa6c3d', '#4e230d'];

function ColorToggleButton({ value, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange((value + 1) % BUTTON_COLORS.length); }}
      style={{
        width: `${BUTTON_SIZE}px`,
        height: `${BUTTON_SIZE}px`,
        borderRadius: '24px',
        backgroundColor: BUTTON_COLORS[value],
        border: '5px solid #000000',
        cursor: 'pointer',
        padding: 0,
        boxSizing: 'border-box',
      }}
    />
  );
}

// ============================================================
// URL チップ
// ============================================================
const extractDomain = (url) => {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
};

function UrlChip({ url, onActivate, onShortTap }) {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef(null);
  const longPressedRef = useRef(false);
  const touchHandledRef = useRef(false);

  const startPress = (e) => {
    e.stopPropagation();
    setIsPressed(true);
    longPressedRef.current = false;
    timerRef.current = setTimeout(() => { longPressedRef.current = true; }, 500);
  };
  const endPress = (e) => {
    if (e) e.stopPropagation();
    setIsPressed(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (longPressedRef.current) {
      if (e) e.preventDefault();
      onActivate();
    } else {
      if (e) e.preventDefault();
      if (onShortTap) onShortTap();
    }
    longPressedRef.current = false;
  };
  const handleTouchEnd = (e) => {
    touchHandledRef.current = true;
    endPress(e);
    setTimeout(() => { touchHandledRef.current = false; }, 500);
  };
  const cancelPress = (e) => {
    if (e) e.stopPropagation();
    setIsPressed(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    longPressedRef.current = false;
  };
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (touchHandledRef.current) return;
  };

  return (
    <span
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={cancelPress}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        margin: '0 4px',
        height: '64px',
        lineHeight: '64px',
        fontSize: '40px',
        backgroundColor: isPressed ? '#fa6c3d' : '#A0C4FF',
        color: isPressed ? '#ffffff' : '#1a2b4a',
        borderRadius: '16px',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        transition: 'background-color 0.15s, color 0.15s',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
      title="タップで編集、長押しで開く"
    >
      <span style={{ fontSize: '32px' }}>🔗</span>
      <span>{extractDomain(url)}</span>
    </span>
  );
}

const renderTextWithLinks = (text, onShortTap) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <UrlChip
          key={i}
          url={part}
          onActivate={() => { try { window.open(part, '_blank', 'noopener,noreferrer'); } catch (e) {} }}
          onShortTap={onShortTap}
        />
      );
    }
    return <span key={i}>{part}</span>;
  });
};

// ============================================================
// 編集可能なメモ用のグローバルCSS(プレースホルダー色)
// ============================================================
if (typeof document !== 'undefined' && !document.getElementById('editable-memo-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'editable-memo-styles';
  styleEl.textContent = `
    .editable-memo-textarea::placeholder {
      color: #9ca3af;
      opacity: 1;
    }
  `;
  document.head.appendChild(styleEl);
}

// ============================================================
// 編集可能なメモ
// ============================================================
function EditableMemo({ value, onChange, placeholder, forceExitEdit, minHeight = 80, indentLines = 0, indentWidth = 0, onEditingChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const editStartTimeRef = useRef(0);

  useEffect(() => { if (forceExitEdit) setIsEditing(false); }, [forceExitEdit]);
  useEffect(() => { if (onEditingChange) onEditingChange(isEditing); }, [isEditing, onEditingChange]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      try {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
        textareaRef.current.style.height = `${minHeight}px`;
        const sh = textareaRef.current.scrollHeight;
        if (sh > minHeight) textareaRef.current.style.height = sh + 'px';
      } catch (e) {}
      editStartTimeRef.current = Date.now();
    }
  }, [isEditing, minHeight]);

  useEffect(() => {
    if (textareaRef.current && isEditing) {
      try {
        textareaRef.current.style.height = `${minHeight}px`;
        const sh = textareaRef.current.scrollHeight;
        if (sh > minHeight) textareaRef.current.style.height = sh + 'px';
      } catch (e) {}
    }
  }, [value, isEditing, minHeight]);

  const enterEditMode = () => setIsEditing(true);

  const containerStyle = { margin: '10px', position: 'relative' };
  const textStyleBase = {
    width: '100%',
    minHeight: `${minHeight}px`,
    fontSize: '60px',
    lineHeight: '80px',
    padding: '0 16px',
    boxSizing: 'border-box',
    textAlign: 'left',
    fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, -apple-system, sans-serif',
  };

  const floatShape = indentLines > 0 ? (
    <div style={{
      float: 'left',
      width: `${indentWidth}px`,
      height: `${80 * indentLines}px`,
      shapeOutside: 'inset(0)',
      pointerEvents: 'none',
    }} />
  ) : null;

  return (
    <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
      {isEditing ? (
          <textarea
            ref={textareaRef}
            className="editable-memo-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={(e) => {
              if (Date.now() - editStartTimeRef.current < 300) return;
              const sel = e.target.selectionStart !== e.target.selectionEnd;
              if (!sel) setIsEditing(false);
            }}
            placeholder={placeholder}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            style={{
              ...textStyleBase,
              paddingLeft: indentLines > 0 ? `${indentWidth + 16}px` : '16px',
              border: '6px solid #9ca3af',
              borderRadius: '24px',
              backgroundColor: '#e5e7eb',
              color: '#000000',
              caretColor: '#1f2937',
              resize: 'none', outline: 'none', overflow: 'auto', display: 'block',
              WebkitUserSelect: 'text', userSelect: 'text', WebkitTouchCallout: 'default',
            }}
          />
      ) : (
        <div onClick={() => setIsEditing(true)}
          style={{
            ...textStyleBase,
            border: value ? '3px solid transparent' : '3px solid #e5e7eb',
            borderRadius: '24px',
            backgroundColor: value ? 'transparent' : '#f0f1f3',
            wordBreak: 'break-word',
            color: '#000000',
            cursor: 'text',
          }}>
          {floatShape}
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {value ? renderTextWithLinks(value, enterEditMode) : ''}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function FlashcardSystem() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [notes, setNotes] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isAnyEditing, setIsAnyEditing] = useState(false);

  // 色フィルター: 空配列 = 全表示、要素あり = その色のカードのみ(複数選択可)
  const [colorFilter, setColorFilter] = useState([]);
  // メニュー内のプレビュー用選択状態(目次のみに即時反映、巡回はメニュー閉じ時に確定)
  const [pendingColorFilter, setPendingColorFilter] = useState([]);
  // モーダル: 'menu' | null
  const [activeModal, setActiveModal] = useState(null);
  // ページ移動時に flip アニメーションをスキップ
  const [skipFlipAnimation, setSkipFlipAnimation] = useState(false);

  // メニューを開く:現在のフィルター状態をプレビューにコピー
  const openMenu = () => {
    setPendingColorFilter([...colorFilter]);
    setActiveModal('menu');
  };
  // メニューを閉じる:プレビューの選択状態を確定してフラッシュカード巡回に反映
  const closeMenu = () => {
    const prev = colorFilter;
    const next = pendingColorFilter;
    const changed =
      prev.length !== next.length ||
      !prev.every((v) => next.includes(v));
    if (changed) {
      setSkipFlipAnimation(true);
      setColorFilter([...next]);
      setCurrentIndex(0);
      setIsFlipped(false);
      setTimeout(() => setSkipFlipAnimation(false), 250);
    }
    setActiveModal(null);
  };

  // プレビュー選択をトグル
  const togglePendingColor = (idx) => {
    setPendingColorFilter((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx]
    );
  };

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 400
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // データ読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function') {
          const result = await window.storage.get('flashcard-notes');
          if (result && result.value) {
            const parsed = JSON.parse(result.value);
            if (parsed && typeof parsed === 'object') setNotes(parsed);
          }
        }
      } catch (e) {}
      setLoaded(true);
    };
    loadData();
  }, []);

  // データ保存
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(async () => {
      try {
        if (typeof window !== 'undefined' && window.storage && typeof window.storage.set === 'function') {
          await window.storage.set('flashcard-notes', JSON.stringify(notes));
          setSaveStatus('保存済み');
          setTimeout(() => setSaveStatus(''), 1500);
        }
      } catch (e) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [notes, loaded]);

  const updateNote = (cardId, position, value) => {
    setNotes((prev) => ({ ...prev, [cardId]: { ...(prev[cardId] || {}), [position]: value } }));
  };
  const getNote = (cardId, position) => (notes && notes[cardId] && notes[cardId][position]) || '';
  const getButtonState = (cardId) => (notes && notes[cardId] && typeof notes[cardId].buttonState === 'number') ? notes[cardId].buttonState : 0;
  const setButtonState = (cardId, value) => {
    setNotes((prev) => ({ ...prev, [cardId]: { ...(prev[cardId] || {}), buttonState: value } }));
  };

  // フラッシュカード巡回用:確定済みフィルター適用(表紙はフィルター時には含めない)
  const visibleCards = colorFilter.length === 0
    ? CARDS
    : CARDS.filter((c) => !c.isCover && colorFilter.includes(getButtonState(c.id)));

  // 目次プレビュー用:メニュー内の選択状態を即時反映(表紙はフィルター時には含めない)
  const previewCards = pendingColorFilter.length === 0
    ? CARDS
    : CARDS.filter((c) => !c.isCover && pendingColorFilter.includes(getButtonState(c.id)));

  // currentIndexがvisibleCardsの範囲外になったら0に戻す
  useEffect(() => {
    if (currentIndex >= visibleCards.length) {
      setCurrentIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorFilter]);

  const goNext = () => {
    if (currentIndex < visibleCards.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setSkipFlipAnimation(true);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => {
        setSkipFlipAnimation(false);
        setIsAnimating(false);
      }, 250);
    }
  };
  const goPrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setSkipFlipAnimation(true);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => {
        setSkipFlipAnimation(false);
        setIsAnimating(false);
      }, 250);
    }
  };

  // 目次から特定のカードに移動(元のCARDS配列のインデックス指定)
  const jumpToCard = (originalIndex) => {
    const targetCard = CARDS[originalIndex];
    if (!targetCard) return;
    const idxInVisible = visibleCards.findIndex((c) => c.id === targetCard.id);
    if (idxInVisible >= 0) {
      setSkipFlipAnimation(true);
      setIsFlipped(false);
      setCurrentIndex(idxInVisible);
      setTimeout(() => setSkipFlipAnimation(false), 250);
    } else {
      // フィルターで隠れているカードに飛ぶ場合 → フィルター解除して移動
      setColorFilter([]);
      setSkipFlipAnimation(true);
      setIsFlipped(false);
      setCurrentIndex(originalIndex);
      setTimeout(() => setSkipFlipAnimation(false), 250);
    }
  };

  // タッチイベント(スワイプ)
  const handleTouchStart = (e) => {
    if (e.target.tagName === 'TEXTAREA') return;
    if (e.touches.length >= 2) {
      // 2本指はピンチに任せる
      setTouchStartX(null); setTouchStartY(null);
      setDragOffset(0);
      return;
    }
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    if (e.touches.length >= 2) {
      setDragOffset(0); setTouchStartX(null); setTouchStartY(null);
      return;
    }
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) setDragOffset(deltaX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (dragOffset > 60) goPrev();
    else if (dragOffset < -60) goNext();
    setDragOffset(0); setTouchStartX(null); setTouchStartY(null);
  };

  // マウスイベント(PC用)
  const [mouseStartX, setMouseStartX] = useState(null);
  const justSwipedRef = useRef(false);
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    setMouseStartX(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (mouseStartX === null) return;
    setDragOffset(e.clientX - mouseStartX);
  };
  const handleMouseUp = () => {
    if (mouseStartX === null) return;
    if (dragOffset > 60) { justSwipedRef.current = true; goPrev(); }
    else if (dragOffset < -60) { justSwipedRef.current = true; goNext(); }
    setDragOffset(0); setMouseStartX(null);
  };

  // キーボード
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === ' ') { e.preventDefault(); setIsFlipped((f) => !f); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAnimating]);

  // フリップ・ページ切り替え時にメモの編集を抜ける
  const [exitEditSignal, setExitEditSignal] = useState(0);
  useEffect(() => { setExitEditSignal((n) => n + 1); }, [isFlipped, currentIndex]);

  // ページ番号表示
  const [showPageNumber, setShowPageNumber] = useState(false);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setShowPageNumber(true);
    const timer = setTimeout(() => setShowPageNumber(false), 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const card = visibleCards[currentIndex] || visibleCards[0] || CARDS[0];
  // CARDS配列上のインデックス(色フィルター適用時にも元の番号でページ表示するため)
  const cardOriginalIndex = CARDS.findIndex((c) => c.id === card.id);

  // 横幅1080pxで固定(絶対条件)
  // 画面幅に合わせてscaleを決定し、横幅は常に画面幅ぴったり
  const scale = viewportWidth / CARD_WIDTH;

  // body/html および iframe の親要素まで遡ってスクロールを抑止
  useEffect(() => {
    const targets = [];
    try {
      let el = document.documentElement;
      while (el) {
        targets.push({
          el,
          overflow: el.style.overflow,
          margin: el.style.margin,
          padding: el.style.padding,
          height: el.style.height,
        });
        el.style.overflow = 'hidden';
        if (el === document.documentElement || el === document.body) {
          el.style.margin = '0';
          el.style.padding = '0';
          el.style.height = '100%';
        }
        el = el.parentElement;
      }
      // bodyを別途明示
      if (document.body) {
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.height = '100%';
      }
    } catch (e) {}
    return () => {
      targets.forEach(({ el, overflow, margin, padding, height }) => {
        try {
          el.style.overflow = overflow;
          el.style.margin = margin;
          el.style.padding = padding;
          el.style.height = height;
        } catch (e) {}
      });
    };
  }, []);

  // scaleコンテナの実コンテンツ高さを計測
  // - 表面は常に1920px固定
  // - 裏面のみ実コンテンツ高さで判定(ResizeObserverで裏面要素のみを計測)
  // - 1920px以下 → 1920pxに揃える(青背景で埋める、スクロールなし)
  // - 1920pxを超える → 実高さに合わせる(スクロールで見える)
  const backRef = useRef(null);
  const [backHeight, setBackHeight] = useState(CARD_HEIGHT);
  useEffect(() => {
    if (!backRef.current) return;
    const el = backRef.current;
    const update = () => {
      const h = el.scrollHeight || CARD_HEIGHT;
      setBackHeight(Math.max(CARD_HEIGHT, h));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 表示中の面のコンテンツ高さ(表面=固定1920、裏面=実測)
  const contentHeight = card.isCover ? CARD_HEIGHT : (isFlipped ? backHeight : CARD_HEIGHT);
  // 縮小後のコンテンツ高さ
  const scaledContentHeight = contentHeight * scale;
  // スクロールの要否:縮小後の高さが画面より大きいか
  const needsScroll = scaledContentHeight > viewportHeight;

  // スクロールコンテナのref(ページ移動・反転時に頭出しするため)
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex, isFlipped]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: `${viewportWidth}px`,
      height: `${viewportHeight}px`,
      backgroundColor: '#000000',
      overflow: 'hidden',
    }}>
      <div ref={scrollContainerRef} style={{
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
        backgroundColor: '#000000',
        overflowX: 'hidden',
        overflowY: needsScroll ? 'auto' : 'hidden',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
      }}>
        {/* スクロール可動域を縮小後のサイズに合わせるための内側スペーサー */}
        <div style={{
          width: `${viewportWidth}px`,
          height: `${scaledContentHeight}px`,
          position: 'relative',
        }}>
          <div style={{
            width: `${CARD_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
            <AppContent
              card={card}
              currentIndex={currentIndex}
              cardOriginalIndex={cardOriginalIndex}
              isFlipped={isFlipped}
              saveStatus={saveStatus}
              dragOffset={dragOffset}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              handleTouchEnd={handleTouchEnd}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              setIsFlipped={setIsFlipped}
              getNote={getNote}
              updateNote={updateNote}
              getButtonState={getButtonState}
              setButtonState={setButtonState}
              exitEditSignal={exitEditSignal}
              showPageNumber={showPageNumber}
              setIsAnyEditing={setIsAnyEditing}
              backRef={backRef}
              contentHeight={contentHeight}
              justSwipedRef={justSwipedRef}
              skipFlipAnimation={skipFlipAnimation}
              setActiveModal={setActiveModal}
              colorFilter={colorFilter}
              activeModal={activeModal}
              openMenu={openMenu}
              closeMenu={closeMenu}
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          モーダル(色フィルター + 目次)
      ============================================================ */}
      {activeModal && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
            paddingTop: `${(30 + BUTTON_SIZE + 30) * scale}px`,
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* ☰ボタンと同じ画面位置・サイズの閉じる(×)ボタン
              色・縁取り・フォントは色フィルターメニューの解除ボタン(✕)と同じ */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
            style={{
              position: 'absolute',
              top: `${30 * scale}px`,
              right: `${30 * scale}px`,
              width: `${BUTTON_SIZE * scale}px`,
              height: `${BUTTON_SIZE * scale}px`,
              borderRadius: `${20 * scale}px`,
              border: `${5 * scale}px solid #000000`,
              boxSizing: 'border-box',
              backgroundColor: pendingColorFilter.length > 0 ? '#4ca626' : '#9ca3af',
              color: pendingColorFilter.length > 0 ? '#fff' : '#1f2937',
              fontSize: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              padding: 0,
              lineHeight: 1,
              zIndex: 2100,
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              appearance: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            title="閉じる"
          >
            ✕
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#d1d5db',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              color: '#000',
            }}
          >
            {/* --- 色フィルターセクション --- */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                {BUTTON_COLORS.map((color, idx) => {
                  const count = CARDS.filter((c) => !c.isCover && getButtonState(c.id) === idx).length;
                  const isActive = pendingColorFilter.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (count === 0) return;
                        togglePendingColor(idx);
                      }}
                      disabled={count === 0}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: isActive
                          ? `linear-gradient(to bottom, ${color} 0%, ${color} 50%, #4ca626 50%, #4ca626 100%)`
                          : color,
                        border: '2px solid #000000',
                        cursor: count === 0 ? 'not-allowed' : 'pointer',
                        opacity: count === 0 ? 0.25 : 1,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '21px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        flexShrink: 0,
                      }}
                      title={`${count}枚${isActive ? '(選択中)' : ''}`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- 区切り線 --- */}
            <div style={{
              height: '1px',
              backgroundColor: 'rgba(0,0,0,0.15)',
              margin: '0 0 16px 0',
            }} />

            {/* --- 目次セクション(プレビュー絞り込み済み) --- */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {previewCards.length === 0 && (
                  <div style={{ color: '#888', fontSize: '13px', padding: '12px', textAlign: 'center' }}>
                    該当するカードがありません
                  </div>
                )}
                {previewCards.map((c) => {
                  const originalIdx = CARDS.findIndex((x) => x.id === c.id);
                  const colorIdx = getButtonState(c.id);
                  const isCurrent = card.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        // pending選択を確定してから移動
                        const next = pendingColorFilter;
                        const prev = colorFilter;
                        const changed =
                          prev.length !== next.length ||
                          !prev.every((v) => next.includes(v));
                        if (changed) {
                          setColorFilter([...next]);
                        }
                        // 確定後の visibleCards で何枚目かを再計算(表紙はフィルター時には含めない)
                        const newVisible = next.length === 0
                          ? CARDS
                          : CARDS.filter((cc) => !cc.isCover && next.includes(getButtonState(cc.id)));
                        const newIdx = newVisible.findIndex((cc) => cc.id === c.id);
                        setSkipFlipAnimation(true);
                        setIsFlipped(false);
                        setCurrentIndex(newIdx >= 0 ? newIdx : 0);
                        setTimeout(() => setSkipFlipAnimation(false), 250);
                        setActiveModal(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: isCurrent ? '2px solid #000000' : '2px solid transparent',
                        backgroundColor: isCurrent ? '#9ca3af' : '#e5e7eb',
                        color: '#000',
                        fontSize: '15px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {!c.isCover && (
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: BUTTON_COLORS[colorIdx],
                          border: '2px solid #6b7280',
                          flexShrink: 0,
                        }} />
                      )}
                      {!c.isCover && (
                        <span style={{
                          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
                          minWidth: `${String(CARDS.length).length}ch`,
                          textAlign: 'right',
                          flexShrink: 0,
                        }}>
                          {originalIdx}.
                        </span>
                      )}
                      <span style={{ flex: 1 }}>
                        {c.isCover ? '表紙' : (c.title || `カード${originalIdx}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// カード本体
// ============================================================
function AppContent({
  card, currentIndex, cardOriginalIndex, isFlipped, saveStatus, dragOffset,
  handleTouchStart, handleTouchMove, handleTouchEnd,
  handleMouseDown, handleMouseMove, handleMouseUp,
  setIsFlipped,
  getNote, updateNote, getButtonState, setButtonState,
  exitEditSignal, showPageNumber, setIsAnyEditing,
  backRef, contentHeight, justSwipedRef, skipFlipAnimation,
  setActiveModal, colorFilter, activeModal, openMenu, closeMenu,
}) {
  const [topEditing, setTopEditing] = useState(false);
  const [bottomEditing, setBottomEditing] = useState(false);
  const isAnyMemoEditing = topEditing || bottomEditing;

  useEffect(() => {
    if (setIsAnyEditing) setIsAnyEditing(isAnyMemoEditing);
  }, [isAnyMemoEditing, setIsAnyEditing]);

  const [localExitEditSignal, setLocalExitEditSignal] = useState(0);
  const combinedExitEditSignal = exitEditSignal + localExitEditSignal;

  const handleCardTap = (e) => {
    if (
      e.target.tagName === 'TEXTAREA' || e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
      (e.target.closest && (e.target.closest('a') || e.target.closest('button') || e.target.closest('textarea')))
    ) return;
    // マウスドラッグでスワイプ移動した直後のクリックは無視
    if (justSwipedRef && justSwipedRef.current) {
      justSwipedRef.current = false;
      return;
    }
    // 表紙は片面のみなのでフリップしない
    if (card.isCover) return;
    if (isAnyMemoEditing) {
      setLocalExitEditSignal((n) => n + 1);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  // 裏面 中段画像の高さ(最小200px、表紙は裏面なし)
  const backMidHeight = card.isCover
    ? 0
    : Math.max(BACK_MIDDLE_IMG_MIN_HEIGHT, card.backMid.height || BACK_MIDDLE_IMG_MIN_HEIGHT);

  return (
    <div style={{
      width: `${CARD_WIDTH}px`,
      position: 'relative',
      backgroundColor: '#ffffff',
    }}>
      {/* ページ番号オーバーレイ */}
      {showPageNumber && !card.isCover && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '300px', fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.2)',
            fontFamily: '"Hiragino Sans", "Yu Gothic", system-ui, sans-serif',
            lineHeight: 1,
            textShadow: '0 4px 24px rgba(255,255,255,0.3)',
          }}>
            {cardOriginalIndex}
          </div>
        </div>
      )}

      {/* 保存状態表示 */}
      {saveStatus && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          backgroundColor: 'rgba(147, 186, 234, 0.9)',
          color: '#1a2b4a',
          padding: '8px 24px',
          borderRadius: '20px',
          fontSize: '32px',
          fontWeight: 'bold',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          {saveStatus}
        </div>
      )}

      <div style={{
        width: `${CARD_WIDTH}px`,
        height: `${contentHeight}px`,
        perspective: '3000px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${CARD_WIDTH}px`,
          height: `${contentHeight}px`,
          transform: `translateX(${dragOffset}px)`,
          transition: dragOffset === 0 ? 'transform 0.3s ease-out' : 'none',
        }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div onClick={handleCardTap}
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${contentHeight}px`,
              cursor: card.isCover ? 'default' : 'pointer',
              transformStyle: 'preserve-3d',
              transition: skipFlipAnimation ? 'none' : 'transform 0.6s',
              transform: (isFlipped && !card.isCover) ? 'rotateY(180deg)' : 'rotateY(0deg)',
              position: 'relative',
            }}>

            {/* ============================================================
                表面: 1080x1920の画像のみ(余白なし)
            ============================================================ */}
            <div style={{
              width: `${CARD_WIDTH}px`,
              minHeight: `${CARD_HEIGHT}px`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: (isFlipped && !card.isCover) ? 'absolute' : 'relative',
              top: 0, left: 0,
              backgroundColor: '#ffffff',
            }}>
              <CardImage
                imageUrl={card.front.imageUrl}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                label={card.front.label}
                bgColor={card.front.bgColor}
                fgColor={card.front.fgColor}
              />
            </div>

            {/* ============================================================
                裏面: (表紙の場合は表示しない)
                  1. 1080x100 上端バナー画像(余白なし)
                  2. 4色ボタン + 上のメモ
                  3. 1080x可変(最小200) 中段画像(余白なし)
                  4. 下のメモ
            ============================================================ */}
            {!card.isCover && (
            <div ref={backRef} style={{
              width: `${CARD_WIDTH}px`,
              minHeight: `${CARD_HEIGHT}px`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: isFlipped ? 'relative' : 'absolute',
              top: 0, left: 0,
              backgroundColor: '#ffffff',
            }}>
              {/* 1. 上端バナー画像 + 目次ボタン
                  Banner: カード左端から幅900px×高さ150px
                  目次ボタン: 上30/右30の余白を取った位置に120×120px
              */}
              <div style={{ position: 'relative' }}>
                <CardImage
                  imageUrl={card.backTop.imageUrl}
                  width={CARD_WIDTH - BUTTON_SIZE - 30 - 30}
                  height={TOP_BANNER_HEIGHT}
                  label={card.backTop.label}
                  bgColor={card.backTop.bgColor}
                  fgColor={card.backTop.fgColor}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeModal === 'menu') {
                      closeMenu();
                    } else {
                      openMenu();
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    width: `${BUTTON_SIZE}px`,
                    height: `${BUTTON_SIZE}px`,
                    borderRadius: '20px',
                    border: '5px solid #000000',
                    backgroundColor: colorFilter.length > 0 ? '#4ca626' : '#cccccc',
                    color: colorFilter.length > 0 ? '#fff' : '#000',
                    fontSize: '64px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    lineHeight: 1,
                    zIndex: 5,
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    opacity: 1,
                    filter: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = 'none'; }}
                  title="メニュー"
                >
                  ☰
                </button>
              </div>

              {/* 2. ボタン + 上のメモ
                  ① バナー画像↔上のメモのスペーサー(調整中) */}
              <div style={{ height: '20px' }} />
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  zIndex: 5,
                }}>
                  <ColorToggleButton
                    value={getButtonState(card.id)}
                    onChange={(v) => setButtonState(card.id, v)}
                  />
                </div>
                <div style={{ paddingLeft: `${30 + BUTTON_SIZE + 30}px` }}>
                  <EditableMemo
                    value={getNote(card.id, 'top')}
                    onChange={(v) => updateNote(card.id, 'top', v)}
                    placeholder="メモを入力"
                    forceExitEdit={combinedExitEditSignal}
                    minHeight={TOP_MEMO_HEIGHT}
                    onEditingChange={setTopEditing}
                  />
                </div>
              </div>

              {/* ④ 上のメモ↔中段画像のスペーサー(調整中) */}
              <div style={{ height: '20px' }} />

              {/* 3. 中段画像(余白なし、可変高さ、縦横比固定で1080px幅にフィット) */}
              <CardImage
                imageUrl={card.backMid.imageUrl}
                width={CARD_WIDTH}
                height={backMidHeight}
                label={card.backMid.label}
                bgColor={card.backMid.bgColor}
                fgColor={card.backMid.fgColor}
                preserveAspectRatio={true}
              />

              {/* ② 中段画像↔下のメモのスペーサー(調整中) */}
              <div style={{ height: '20px' }} />

              {/* 4. 下のメモ */}
              <EditableMemo
                value={getNote(card.id, 'bottom')}
                onChange={(v) => updateNote(card.id, 'bottom', v)}
                placeholder="メモを入力"
                forceExitEdit={combinedExitEditSignal}
                minHeight={BOTTOM_MEMO_HEIGHT}
                onEditingChange={setBottomEditing}
              />

              {/* ③ 下のメモの下のスペーサー(調整中) */}
              <div style={{ height: '20px' }} />
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
