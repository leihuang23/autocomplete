import data from './data/data.mjs';
import Trie from './utils/trie.mjs';
import autocomplete from './autocomplete/index.mjs';
import { requestAddTag, requestRemoveTag } from './utils/requests.mjs';

const dataSrc = Trie.addAll(data);
const inputEl = document.getElementById('myInput');
let tagNodeList = [];

function createTag(tag) {
  const tagFragment = document.createDocumentFragment();
  const tagEl = document.createElement('div');
  tagEl.setAttribute('data-tag', tag);
  tagEl.setAttribute('class', 'tag');

  tagNodeList.push(tagEl);

  const tagInner = document.createElement('span');
  tagInner.innerText = tag;

  const closeBtn = document.createElement('span');
  closeBtn.innerText = 'x';
  closeBtn.setAttribute('class', 'close');

  tagEl.appendChild(tagInner);
  tagEl.appendChild(closeBtn);

  tagFragment.appendChild(tagEl);
  inputEl.parentNode.insertBefore(tagFragment, inputEl);
  inputEl.value = '';

  closeBtn.addEventListener('click', function onDeleteTag(e) {
    deleteTag(tagEl);
  });
  dataSrc.delete(tag);
  requestAddTag(tag);
}

function deleteTag(tag) {
  const tagContent = tag.dataset.tag;
  tag.parentNode.removeChild(tag);

  // 更新标签列表
  tagNodeList = tagNodeList.filter(node => node.dataset.tag !== tagContent);

  // 标签加回到数据源
  dataSrc.add(tagContent);
  requestRemoveTag(tagContent);
}

function onKeyDown(e) {
  // 处理删除标签
  if (e.keyCode == 8 && !e.target.value) {
    const lastTag = tagNodeList.pop();
    if (lastTag) {
      deleteTag(lastTag);
    }
  }
}

function onInput(e) {
  if (e.data === ',') {
    // 处理逗号 `,`
    const input = e.target.value;
    const tag = input.substring(0, input.length - 1);
    const exactMatch = dataSrc.search(tag);
    if (exactMatch[0] !== tag) return;
    createTag(exactMatch[0]);
  }
}

autocomplete({
  inputEl,
  dataSrc,
  itemClass: 'autocomplete-items',
  itemActiveClass: 'autocomplete-active',
  onSubmitTag: createTag,
  onKeyDown,
  onInput,
  limit: 10
});
