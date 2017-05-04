/* globals httpRequest, renderScene */

import render from 'preact-render-to-string';
import fetch from 'node-fetch';
import { h } from 'preact';

/** @jsx h */

const renderDocument = (obj) => {
  let vdom = generateScene(obj);
  let html = render(vdom);
  return html;
};

const generateScene = (obj) => {
  const p = {
    x: -10, y: 0, z: 0
  };

  const r = {
    x: 0, y: 0, z: 0
  };

  var billboards = [];

  if (!obj.data) {
    return;
  }

  const posts = obj.data.children.filter((c) => c.data.url.match('.jpg')).slice(0, 40);

  billboards = posts.map((c) => {
    p.x += 4;

    if (p.x > 10) {
      p.x = -10;
      p.z -= 8;
    }

    r.y = Math.floor(Math.random() * 90) - 45;

    return (
      <a-entity position={[p.x, p.y, p.z].join(' ')} rotation={[r.x, r.y, r.z].join(' ')}>
        <a-hypercard position='0 1.1 0.1' scale='2.2 2.2 1'>
          <div style={{color: '#000000', padding: '20px'}}>
            <center style={{color: '#000000'}}>
              {c.data.url}
              <img src={c.data.url} style='width: 400px; height: 400px' />
            </center>

            <h3 style={{color: '#000000'}}>{c.data.title.slice(0, 64)}...</h3>
          </div>
        </a-hypercard>
        <a-box scale='3 3 0.19' position='0 1.5 0' color='#f3f3f3' />
      </a-entity>
    );

    <a-obj-model src='models/billboard.obj' rotation='0 0 0' scale='0.60 0.60 0.60' position='0 0 0' />
  });

  return (
    <a-scene>
      {billboards}

      <a-sphere id='sky' position="0 0 0" scale="-64 64 64" color="#ff7700" material="flat-shading: true"></a-sphere>
      <a-box id='floor' position="0 -0.1 0" scale="64 0.01 64" color="#ffffff"></a-box>
    </a-scene>
  );
};

export default function (req, res) {
  fetch('https://www.reddit.com/r/pics.json')
    .then((r) => r.json())
    .then((body) => {
      const html = renderDocument(body);
      res.send(html);
    });
}