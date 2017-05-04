/* globals httpRequest, renderScene */

import render from 'preact-render-to-string';
import { Component, h } from 'preact';
import snuownd from 'snuownd';

/** @jsx h */

const renderDocument = (obj) => {
  let vdom = generateScene(obj);
  let html = render(vdom);
  console.log('Calling renderScene()');
  console.log(html);
  renderScene(html);
};

class Votes extends Component {
  render(props, state) {
    return <b style='color: red; border: 1px solid red;'>{props.post.ups - props.post.downs}</b>;
  }
};

class Replies extends Component {
  render(props, state) {
    if (!props.replies.data) {
      return <div />;
    }

    let replies = props.replies.data.children.map((c) => {
      const html = snuownd.getParser().render(c.data.body);
      const markup = {__html: html};

      return (
        <div>
          <hr />
          <Votes post={c.data} />
          <b style='color: blue'>{c.data.author}</b>
          <div dangerouslySetInnerHTML={markup} />
          <Replies replies={c.data.replies} />
        </div>
      );
    });

    // console.log(replies);

    return <div>{replies}</div>;
  }
}

const generateScene = (obj) => {
  const p = {
    x: -10, y: 0, z: 0
  };

  const r = {
    x: 0, y: 0, z: 0
  };

  var billboards = [];

  if (!obj) {
    console.log('Could not load');
    return;
  }

  const comments = obj[1].data.children.filter((c) => c.data.body).slice(0, 100);

  billboards = comments.map((c) => {
    p.x += 4;

    if (p.x > 10) {
      p.x = -10;
      p.z -= 8;
    }

    // r.y = Math.floor(Math.random() * 90) - 45;

    const html = snuownd.getParser().render(c.data.body);
    const markup = {__html: html};
    const style = `
      *{color: black};
    `;

    // console.log(c.data.replies);

    return (
      <a-entity position={[p.x, p.y, p.z].join(' ')} rotation={[r.x, r.y, r.z].join(' ')}>
        <a-hypercard position='0 1.1 0.1' scale='2.2 2.2 1'>
          <style>{style}</style>

          <Votes post={c.data} />

          <b style='color: blue'>{c.data.author}</b>

          <div dangerouslySetInnerHTML={markup} />

          <Replies replies={c.data.replies} />
        </a-hypercard>
        <a-box scale='2.3 2.3 0.19' position='0 1.15 0' color='#f3f3f3' />
      </a-entity>
    );
  });

  return (
    <scene>
      {billboards}

      <a-sphere id='sky' position='0 0 0' scale='-64 64 64' color='#bbccff' material='flat-shading: true'></a-sphere>
      <a-box id='floor' position='0 -0.1 0' scale='64 0.01 64' color='#ffffff'></a-box>
    </scene>
  );
};

httpRequest('http://localhost:5000/comments.json', (body) => {
  const obj = JSON.parse(body);
  renderDocument(obj);
});
