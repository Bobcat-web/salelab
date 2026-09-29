import { useEffect, useRef, useState } from 'react'

const roadmap = [
  {
    no: '01',
    weeks: 'недели 1–2',
    title: 'Выбираем сегмент',
    text: '15–20 интервью с владельцами и РОПами. Находим 3–5 школ, где есть регулярный поток заявок и доступна история обращений.',
    result: 'Портрет первого клиента',
  },
  {
    no: '02',
    weeks: 'недели 2–4',
    title: 'Проверяем обращения',
    text: 'Тестируем типичные каналы и фиксируем скорость содержательного ответа, наличие следующего шага и повторного контакта.',
    result: 'Карта реальных сбоев',
  },
  {
    no: '03',
    weeks: 'недели 4–8',
    title: 'Связываем CRM и оплаты',
    text: 'Восстанавливаем путь каждой заявки, сравниваем сценарии обработки и переводим потерянные контакты в деньги.',
    result: 'Диагностика потерь',
  },
  {
    no: '04',
    weeks: 'недели 8–16',
    title: 'Проводим пилот',
    text: 'Вводим ответственного, контроль первого ответа и обязательный следующий шаг. Сравниваем с текущим процессом.',
    result: 'Изменение оплаченной конверсии',
  },
  {
    no: '05',
    weeks: 'недели 14–20',
    title: 'Масштабируем результат',
    text: 'Упаковываем методику, проверяем экономику и готовность школы продолжить работу уже в платном формате.',
    result: 'Решение и план внедрения',
  },
]

const team = [
  ['Катя', 'Тимлид', 'Направление проекта, сегмент и ключевые решения'],
  ['Лола', 'Проектный менеджер', 'Сроки, зависимости и прозрачный статус пилота'],
  ['Костя', 'Рыночный аналитик', 'Интервью, спрос и конкурентный контекст'],
  ['Никита', 'Бизнес-аналитик', 'Экономика, цена и окупаемость для школы'],
  ['Вика', 'Развитие бизнеса', 'Контакты школ, партнёры и организация встреч'],
  ['Яна', 'Аналитик данных', 'CRM, звонки, методика диагностики и отчёт'],
]

const metrics = [
  ['Первый контакт', 'Как быстро менеджер действительно связался с человеком'],
  ['Нарушение SLA', 'Сколько заявок получили реакцию позже нормы школы'],
  ['Повторный контакт', 'Кого не удалось поймать с первого раза — и кому не перезвонили'],
  ['Следующий шаг', 'Где разговор состоялся, но продажа остановилась без задачи'],
  ['Контакт → оплата', 'Какие сценарии обработки действительно заканчиваются продажей'],
  ['Упущенная выручка', 'Сколько может стоить школе повторяющийся процессный сбой'],
]

function LeadGrid() {
  const cells = Array.from({ length: 63 })
  const path = new Set([4, 13, 22, 31, 40, 49, 58])
  const branch = new Set([21, 23, 29, 30, 32, 33, 39, 41])
  const warning = new Set([12, 14, 20, 24, 38, 42, 48, 50])

  return (
    <div className="lead-grid" aria-label="Схема движения заявки от входа до оплаты">
      {cells.map((_, index) => {
        const cls = path.has(index)
          ? 'tile tile-main'
          : branch.has(index)
            ? 'tile tile-branch'
            : warning.has(index)
              ? 'tile tile-warning'
              : 'tile'
        return <span className={cls} key={index} style={{ '--i': index }} />
      })}
      <div className="flow-label flow-label-1">заявка</div>
      <div className="flow-label flow-label-2">контакт</div>
      <div className="flow-label flow-label-3">оплата</div>
      <span className="moving-lead" />
    </div>
  )
}

function Roadmap() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const timer = window.setInterval(() => {
          setActive((current) => (current + 1) % roadmap.length)
        }, 2600)
        observer.disconnect()
        sectionRef.current.dataset.timer = timer
      },
      { threshold: 0.25 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (sectionRef.current?.dataset.timer) window.clearInterval(Number(sectionRef.current.dataset.timer))
    }
  }, [])

  return (
    <section className="roadmap-section section-dark" id="roadmap" ref={sectionRef}>
      <div className="section-head light reveal">
        <span className="eyebrow">Roadmap / 20 недель</span>
        <h2>От гипотезы — к процессу, который не теряет людей.</h2>
        <p>Каждый этап заканчивается измеримым решением: продолжать, менять направление или остановиться.</p>
      </div>
      <div className="roadmap-shell reveal">
        <div className="roadmap-tabs" role="tablist" aria-label="Этапы проекта">
          {roadmap.map((item, index) => (
            <button
              key={item.no}
              type="button"
              className={active === index ? 'road-tab active' : 'road-tab'}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={active === index}
            >
              <span>{item.no}</span>
              <b>{item.weeks}</b>
            </button>
          ))}
          <span className="road-progress" style={{ '--active': active }} />
        </div>
        <div className="roadmap-card" aria-live="polite">
          <div>
            <span className="road-no">этап {roadmap[active].no}</span>
            <h3>{roadmap[active].title}</h3>
          </div>
          <p>{roadmap[active].text}</p>
          <div className="result-chip"><span />{roadmap[active].result}</div>
        </div>
      </div>
    </section>
  )
}

function App() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="salelab — на главную">sale<span>lab</span></a>
        <nav aria-label="Навигация">
          <a href="#pilot">Пилот</a>
          <a href="#metrics">Метрики</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <a className="contact-pill" href="https://t.me/dem_yank" target="_blank" rel="noreferrer">Связаться</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">Диагностика продаж онлайн-школ</span>
            <h1>Заявка есть,<br /><em>а клиента нет</em></h1>
            <p>Мы поможем найти, где ваша школа теряет клиента после заявки.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="https://t.me/dem_yank" target="_blank" rel="noreferrer">Обсудить пилот</a>
              <a className="text-link" href="#pilot">Как это работает</a>
            </div>
          </div>
          <div className="hero-visual">
            <LeadGrid />
          </div>
          <div className="hero-note">От заявки<br />до оплаты</div>
        </div>
      </section>

      <section className="problem section-pad">
        <div className="problem-title reveal">
          <span className="eyebrow">Проблема</span>
          <h2>Маркетинг привёл человека.<br />Но никто не заметил,<br /><span>где он исчез.</span></h2>
        </div>
        <div className="problem-stack reveal">
          <div className="stack-card stack-orange"><span>01</span>Ответили слишком поздно</div>
          <div className="stack-card stack-lilac"><span>02</span>Не связались повторно</div>
          <div className="stack-card stack-olive"><span>03</span>Не назначили следующий шаг</div>
          <div className="stack-card stack-white"><span>04</span>Потерю списали на «плохой лид»</div>
        </div>
      </section>

      <section className="diagnosis section-pad" id="pilot">
        <div className="section-head reveal">
          <span className="eyebrow">Пилот / 6 недель</span>
          <h2>Восстанавливаем путь заявки. Считаем потери. Показываем, что менять.</h2>
        </div>
        <div className="process-grid">
          {[
            ['01', 'Забираем данные', 'CRM, телефония, переписки и оплаты — без перестройки текущих систем.'],
            ['02', 'Собираем путь', 'Для каждой заявки: поступление, попытки связи, разговор, следующий шаг, оплата или отказ.'],
            ['03', 'Находим разрывы', 'Отделяем поздние ответы, пропущенные follow-up и остановившиеся диалоги от других причин отказа.'],
            ['04', 'Сравниваем группы', 'Проверяем, как сценарий обработки влияет на контакт и оплату внутри одинаковых каналов и программ.'],
            ['05', 'Переводим в деньги', 'Оцениваем потенциально упущенную выручку и стоимость исправления процесса.'],
            ['06', 'Фиксируем следующий шаг', 'Школа получает список приоритетов, владельцев изменений и дату повторного замера.'],
          ].map(([no, title, text]) => (
            <article className="process-card reveal" key={no}>
              <span className="process-no">{no}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="targets section-pad">
        <div className="target-lead reveal">
          <span className="eyebrow">Цели пилота</span>
          <h2>Не «дать рекомендации», а доказать связь между потерянным контактом и деньгами.</h2>
          <p>На 10-й неделе у руководства есть основание для решения: продолжаем, меняем подход или останавливаем эксперимент.</p>
        </div>
        <div className="target-numbers reveal">
          <div className="big-number"><strong>≥70%</strong><span>путей заявок восстановлено</span></div>
          <div className="big-number"><strong>≥90%</strong><span>совпадение CRM и проверенных звонков</span></div>
          <div className="big-number"><strong>≤40 ч</strong><span>работы команды на одну диагностику</span></div>
          <div className="big-number"><strong>≥3×</strong><span>целевая маржа потерь к цене диагностики</span></div>
        </div>
      </section>

      <section className="metrics section-pad" id="metrics">
        <div className="section-head reveal">
          <span className="eyebrow">Ключевые показатели</span>
          <h2>Считаем не заявки в CRM, а сохранённые и потерянные контакты.</h2>
        </div>
        <div className="metrics-list reveal">
          {metrics.map(([title, text], index) => (
            <article className="metric-row" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scope section-pad">
        <div className="scope-board reveal">
          <div className="scope-title">
            <span className="eyebrow">Границы пилота</span>
            <h2>Достаточно узко, чтобы получить честный ответ.</h2>
          </div>
          <div className="scope-items">
            <div><strong>1</strong><span>онлайн-школа</span></div>
            <div><strong>3</strong><span>месяца заявок</span></div>
            <div><strong>300+</strong><span>заявок в месяц</span></div>
            <div><strong>5+</strong><span>менеджеров</span></div>
            <div><strong>+45</strong><span>дней на учёт оплат</span></div>
            <div><strong>1</strong><span>решение на выходе</span></div>
          </div>
        </div>
      </section>

      <section className="evidence section-pad">
        <div className="section-head reveal">
          <span className="eyebrow">Ориентиры из других EdTech-анализов</span>
          <h2>Потери на стыке заявки и контакта уже дают измеримый эффект.</h2>
          <p>Это результаты внешних кейсов, а не обещание salelab. В пилоте мы считаем ваш baseline и проверяем эффект на сопоставимых данных.</p>
        </div>
        <div className="evidence-grid reveal">
          <a href="https://aplora.pro/ru/cases/edtech-sales-department" target="_blank" rel="noreferrer" className="evidence-card orange">
            <span>второй контакт</span><strong>+22%</strong><p>После стандартизации follow-up в EdTech-кейсе</p><small>Aplora / данные заказчика ↗</small>
          </a>
          <a href="https://aplora.pro/ru/cases/edtech-sales-department" target="_blank" rel="noreferrer" className="evidence-card lilac">
            <span>конверсия в сделку</span><strong>+5 п.п.</strong><p>При той же воронке и неизменном предложении</p><small>Aplora / данные заказчика ↗</small>
          </a>
          <a href="https://aplora.pro/ru/cases/learnit-funnel-analysis" target="_blank" rel="noreferrer" className="evidence-card olive">
            <span>4+ касания</span><strong>×4–5</strong><p>Конверсия относительно сценария с одним касанием</p><small>LearnIT / наблюдение по воронке ↗</small>
          </a>
          <a href="https://aplora.pro/ru/cases/edtech-sales-department" target="_blank" rel="noreferrer" className="evidence-card navy">
            <span>рутинное время</span><strong>−70%</strong><p>После автоматизации фиксации и контроля действий</p><small>Aplora / замер операций CRM ↗</small>
          </a>
        </div>
      </section>

      <Roadmap />

      <section className="team section-pad" id="team">
        <div className="section-head reveal">
          <span className="eyebrow">Команда</span>
          <h2>Шесть ролей. Один ответственный контур.</h2>
        </div>
        <div className="team-grid reveal">
          {team.map(([name, role, text], index) => (
            <article className="team-card" key={name}>
              <div className={`avatar avatar-${index + 1}`}>{name.slice(0, 1)}</div>
              <div><h3>{name}</h3><span>{role}</span><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <span className="eyebrow">Следующая заявка может не потеряться</span>
          <h2>Покажем, где ваша школа<br />теряет контакт с клиентом.</h2>
        </div>
        <a className="footer-cta" href="https://t.me/dem_yank" target="_blank" rel="noreferrer">
          <span>Свяжитесь с нами</span><b>@dem_yank</b><i>↗</i>
        </a>
        <div className="footer-bottom"><span>salelab © 2026</span><span>Диагностика потерь продаж онлайн-школ</span></div>
      </footer>
    </main>
  )
}

export default App
