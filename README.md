# Progress Component

Компонент отображает прогресс выполнения процесса в виде кругового индикатора.
Реализован на **чистом JavaScript, HTML и CSS**, без использования библиотек и фреймворков.

Основная задача проекта — создать **переиспользуемый UI-компонент с собственным API**, который не привязан напрямую к конкретной верстке страницы.

---

# Основная идея

Компонент состоит из двух частей:

**ProgressCore**

Логика работы компонента.
Отвечает за состояние, обработку значений и управление renderer.

**DomSvgRenderer**

Отвечает за отображение компонента в DOM через SVG.

Таким образом логика и отображение разделены.

Это позволяет при необходимости заменить renderer (например на Canvas) без изменения API.

---

# Состояния компонента

Компонент поддерживает три основных состояния.

### Normal

Базовое состояние.

Отображается дуга прогресса.

Значение `value` от **0 до 100** управляет длиной дуги.

Дуга начинается с позиции **12 часов** и увеличивается **по часовой стрелке**.

---

### Animated

В этом режиме индикатор вращается по часовой стрелке.

Используется CSS-анимация.

---

### Hidden

Компонент скрывается со страницы.

---

# API компонента

API реализовано в классе **ProgressCore**.

Пример создания компонента:

```javascript
import { ProgressCore } from "./progress/ProgressCore.js"
import { DomSvgRenderer } from "./progress/DomSvgRenderer.js"

const renderer = new DomSvgRenderer(container)

const progress = new ProgressCore(renderer, {
  value: 25,
  animated: false,
  hidden: false
})

progress.mount()
```

---

# Методы API

## setValue(value)

Устанавливает значение прогресса.

```javascript
progress.setValue(50)
```

### Параметры

| параметр | тип    | описание             |
| -------- | ------ | -------------------- |
| value    | number | значение от 0 до 100 |

Если передано значение вне диапазона, оно автоматически ограничивается.

---

## setAnimated(flag)

Включает или выключает режим вращения.

```javascript
progress.setAnimated(true)
```

### Параметры

| параметр | тип     | описание                        |
| -------- | ------- | ------------------------------- |
| flag     | boolean | включить или выключить анимацию |

---

## setHidden(flag)

Скрывает или показывает компонент.

```javascript
progress.setHidden(true)
```

### Параметры

| параметр | тип     | описание                |
| -------- | ------- | ----------------------- |
| flag     | boolean | true — скрыть компонент |

---

## setState(state)

Позволяет изменить несколько параметров состояния сразу.

```javascript
progress.setState({
  value: 70,
  animated: true
})
```

### Параметры

| параметр | тип    | описание                   |
| -------- | ------ | -------------------------- |
| state    | object | новое состояние компонента |

---

## getState()

Возвращает текущее состояние компонента.

```javascript
const state = progress.getState()
```

Пример результата:

```javascript
{
  value: 50,
  animated: false,
  hidden: false
}
```

---

## mount()

Инициализирует компонент и добавляет его в DOM.

```javascript
progress.mount()
```

---

## destroy()

Удаляет компонент из DOM.

```javascript
progress.destroy()
```

---

# Структура проекта

```
project/
│
├── index.html
├── styles.css
├── app.js
│
└── progress/
    ├── ProgressCore.js
    └── DomSvgRenderer.js
```

**index.html**

Demo-страница.

**styles.css**

Стили интерфейса.

**app.js**

Связывает элементы управления с API компонента.

**ProgressCore.js**

Реализует API и управление состоянием.

**DomSvgRenderer.js**

Отвечает за визуализацию через SVG.

