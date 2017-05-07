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
    x: -1.5, y: 1.0, z: 0
  };

  const r = {
    x: 0, y: 0, z: 0
  };

  var billboards = [];

  if (!obj.data) {
    return;
  }

  const posts = obj.data.children.filter((c) => c.data.url.match('.jpg')).slice(0, 14);

  var index = 0;

  billboards = posts.map((c) => {
    index++;

    const focussed = index === 3;

    const scale = focussed ? '1.5 1.5 0.1' : '0.45 0.45 0.1';

    p.x += 0.5;

    if (p.x > 3) {
      p.x = -1;
      p.y += 0.75;
    }

    p.z = focussed ? 0.1 : 0;

    r.y = Math.floor(Math.random() * 90) - 45;

    // lol ASIO
    const imageUrl = c.data.url.replace(/https:/, 'http:');


    return (
      <a-entity position={[p.x, p.y, p.z].join(' ')}>
        <a-hypercard position='0 0.25 0.1' scale={scale}>
          <div style={{color: '#000000', background: '#cacaca', padding: '10px'}}>
            <center>
              <img src={imageUrl} style='width: 400px; height: 400px' />
            </center>

            <h3 style={{color: '#000000'}}>{c.data.title.slice(0, 64)}...</h3>
          </div>
        </a-hypercard>
      </a-entity>
    );

    // <a-box scale='0.5 0.5 0.09' position='0 0.25 0' color='#cacaca' />
    // <a-obj-model src='models/billboard.obj' rotation='0 0 0' scale='0.60 0.60 0.60' position='0 0 0' />
  });

  return (
    <a-scene>
      {billboards}

      <a-sphere id='sky' position="0 0 0" scale="-64 64 64" color="#ff7700" material="flat-shading: true"></a-sphere>
      <a-box id='floor' position="0 -0.1 0" scale="64 0.01 64" color="#777777"></a-box>
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