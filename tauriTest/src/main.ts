function initAdvancedResizer() {
  const layout = document.querySelector('.editor-layout') as HTMLElement;
  if (!layout) return;

  // NodeList を HTMLElement の配列として扱う
  const panels = document.querySelectorAll('.panel');

  panels.forEach((el) => {
    const panel = el as HTMLElement; // ここで型を確定させる

    // e を Event 型で受け取り、中で MouseEvent にキャストする
    panel.addEventListener('mousedown', ((e: Event) => {
      const mouseEvent = e as MouseEvent; 
      const rect = panel.getBoundingClientRect();
      const edgeSize = 15; // 判定を少し広くする（使いやすさのため）

      const isRight = mouseEvent.clientX > rect.right - 10 && mouseEvent.clientX < rect.right + 10;
      const isLeft = mouseEvent.clientX < rect.left + edgeSize;
      const isBottom = mouseEvent.clientY > rect.bottom - edgeSize;

      if (!isRight && !isBottom && !isLeft) return;

      mouseEvent.preventDefault();
      document.body.style.pointerEvents = 'none'; 
      document.body.style.cursor = isBottom ? 'row-resize' : 'col-resize';

      const onMouseMove = (moveEvent: MouseEvent) => {
        // 1. Hierarchy (右端)
        if (panel.id === 'hierarchy' && isRight) {
          const w = Math.max(50, moveEvent.clientX);
          layout.style.setProperty('--hierarchy-width', `${w}px`);
        }

        // 2. Inspector (左端)
        if (panel.id === 'inspector' && isLeft) {
          const w = Math.max(50, window.innerWidth - moveEvent.clientX);
          layout.style.setProperty('--inspector-width', `${w}px`);
        }

        // 3. 下段のリサイズ (Asset Browserなど)
        if (isBottom && (panel.id === 'hierarchy' || panel.id === 'scene')) {
          // Y軸の計算：画面の高さ - マウスの位置 = 下からの高さ
          const h = Math.max(50, window.innerHeight - moveEvent.clientY);  
          layout.style.setProperty('--assets-height', `${h}px`);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.pointerEvents = 'auto';
        document.body.style.cursor = 'default';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }) as EventListener); // 型の不整合を強制的に解消
  });
}

initAdvancedResizer();