/** TODO: コメント丁寧に!
 * 
 */

'use strict';

const lectureData = JSON.parse(document.querySelector('#lecture-data').text);
const template = document.querySelector('#daily-data-template');

for (let day in lectureData) {
  /** 新規ノードの作成 */
  const dailyContent = template.content.cloneNode(true);
  const a = dailyContent.querySelector('a');
  a.textContent = lectureData[day].name;
  a.href = lectureData[day].link;
  dailyContent.querySelector('span').textContent = lectureData[day].classroom;
  /** <td>要素のクラス設定とコンテンツの挿入 */
  const tdParent = document.querySelector('td[headers="' + day + '"]');
  if (tdParent != undefined) {
    for (let clazz of lectureData[day].styleClass.split('\u0020')) {
      tdParent.classList.add(clazz);
    }
    tdParent.appendChild(dailyContent);
  }
}
