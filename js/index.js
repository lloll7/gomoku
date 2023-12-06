(function () {
  // 创建两个dom查询函数
  function $(dom) {
    return document.querySelector(dom);
  }
  function $$(doms) {
    return document.querySelectorAll(doms);
  }
  let chess_board = $(".chess_board");
  let isGameOver = false; // 记录游戏状态（是否结束）
  let WitchOne = "white"; // 记录当前棋子的颜色
  let chessArr = []; // 存入落下的棋子(按顺序)

  //   游戏入口函数
  function main() {
    // 初始化棋盘
    initChessBoard(14, 14);
    // 绑定事件函数
    bindEvent();
  }
  main();
  /**
   *
   * @param {number} width 棋盘的宽
   * @param {number} height 棋盘的高
   */
  function initChessBoard(width, height) {
    if (chess_board.innerHTML) {
      // 如果棋盘有棋子,则清空
      chess_board.innerHTML = "";
    }
    // 创建个width x height的棋盘
    // 创建个文档片段提高拆入dom元素的效率效率
    let frag = document.createDocumentFragment();
    for (let i = 0; i < width; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < height; j++) {
        let td = document.createElement("td");
        td.setAttribute("data-row", i); // 记录是第几行
        td.setAttribute("data-column", j); // 记录是第几列
        tr.appendChild(td);
      }
      frag.appendChild(tr);
    }
    chess_board.appendChild(frag);
  }

  function bindEvent() {
    // 事件委托
    chess_board.addEventListener("click", function (e) {
      if (!isGameOver) {
        // 如果游戏未结束,则点击后要落子
        let temp = Object.assign({}, e.target.dataset); // 创建一个对象, 存入e.target的属性
        if (e.target.tagName === "TD") {
          // 计算出每个格子的边长
          let chessSide = chess_board.clientWidth / 14;
          //   计算用户落子是在格子四个角的哪个角
          let positionX = e.offsetX > chessSide / 2;
          let positionY = e.offsetY > chessSide / 2;

          //   组装棋子的信息
          let chessPoint = {
            x: positionX ? parseInt(temp.column) + 1 : parseInt(temp.column), // 列代表x轴
            y: positionY ? parseInt(temp.row) + 1 : parseInt(temp.row), // 行代表y轴
            c: WitchOne,
          };
          //   绘制棋子
          chessMove(chessPoint);
        }
      } else {
        // 如果游戏结束了,则询问是否要重新开一把
        if (window.confirm("是否要重新开始一局?")) {
          // 进行一些初始化操作
          chessArr = []; // 初始化落子列表
          initChessBoard(14, 14); // 初始化棋盘
          isGameOver = false; // 初始化胜负判断变量
        }
      }
    });
  }
  //   绘制棋子
  function chessMove(chessPoint) {
    // 如果位置上没有棋子同时游戏也还没结束,则落子
    if (!exist(chessPoint) && !isGameOver) {
      // 进入if则符合落子条件
      // 先将新棋子信息对象加入chessArr
      chessArr.push(chessPoint);

      //   创建新棋子
      let newChess = `<div class="chess ${chessPoint.c}" data-row=${chessPoint.y} data-column=${chessPoint.x}></div>`;
      if (chessPoint.x < 14 && chessPoint.y < 14) {
        let tdPos = $(
          `td[data-row='${chessPoint.y}'][data-column='${chessPoint.x}']`
        );
        tdPos.innerHTML += newChess;
      }
      /*
        落子有三种特殊情况，是要落在同一个td上
      */
      // 如果落子在最右侧
      if (chessPoint.x === 14 && chessPoint.y < 14) {
        let tdPos = $(`td[data-row='${chessPoint.y}'][data-column='13']`);
        tdPos.innerHTML += newChess;
        tdPos.lastChild.style.left = "50%";
      }
      // 如果落子在最下侧
      if (chessPoint.x < 14 && chessPoint.y === 14) {
        let tdPos = $(`td[data-row='13'][data-column='${chessPoint.x}']`);
        tdPos.innerHTML += newChess;
        tdPos.lastChild.style.top = "50%";
      }
      // 如果落子在最右下侧
      if (chessPoint.x === 14 && chessPoint.y === 14) {
        let tdPos = $(`td[data-row='13'][data-column='13']`);
        tdPos.innerHTML += newChess;
        tdPos.lastChild.style.top = "50%";
        tdPos.lastChild.style.left = "50%";
      }
      WitchOne = WitchOne === "white" ? "black" : "white"; // 切换棋子的颜色
    }
    check(); // 检查游戏是否已结束
  }
  //   判断该位置上棋子是否已存在
  function exist(chessPoint) {
    let result = chessArr.find(function (item) {
      return item.x === chessPoint.x && item.y === chessPoint.y;
    });

    return result === undefined ? false : true;
  }
  //   检查是否结束
  function check() {
    for (let i = 0; i < chessArr.length; i++) {
      let curChess = chessArr[i];
      let chess2, chess3, chess4, chess5;
      //   一共结束分四种情况:横着,竖着,斜着(两种)

      //   检查横着的有没有结束
      chess2 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 1 &&
          curChess.y === item.y &&
          curChess.c === item.c
        );
      });
      chess3 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 2 &&
          curChess.y === item.y &&
          curChess.c === item.c
        );
      });
      chess4 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 3 &&
          curChess.y === item.y &&
          curChess.c === item.c
        );
      });
      chess5 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 4 &&
          curChess.y === item.y &&
          curChess.c === item.c
        );
      });
      if (chess2 && chess3 && chess4 && chess5) {
        // 进入此 if，说明游戏结束
        end(curChess, chess2, chess3, chess4, chess5);
      }

      // 检查有没有竖着的 5 个颜色一样的棋子
      chess2 = chessArr.find(function (item) {
        return (
          curChess.x === item.x &&
          curChess.y === item.y + 1 &&
          curChess.c === item.c
        );
      });
      chess3 = chessArr.find(function (item) {
        return (
          curChess.x === item.x &&
          curChess.y === item.y + 2 &&
          curChess.c === item.c
        );
      });
      chess4 = chessArr.find(function (item) {
        return (
          curChess.x === item.x &&
          curChess.y === item.y + 3 &&
          curChess.c === item.c
        );
      });
      chess5 = chessArr.find(function (item) {
        return (
          curChess.x === item.x &&
          curChess.y === item.y + 4 &&
          curChess.c === item.c
        );
      });
      if (chess2 && chess3 && chess4 && chess5) {
        // 进入此 if，说明游戏结束
        end(curChess, chess2, chess3, chess4, chess5);
      }

      // 检查有没有斜着的 5 个颜色一样的棋子
      chess2 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 1 &&
          curChess.y === item.y + 1 &&
          curChess.c === item.c
        );
      });
      chess3 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 2 &&
          curChess.y === item.y + 2 &&
          curChess.c === item.c
        );
      });
      chess4 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 3 &&
          curChess.y === item.y + 3 &&
          curChess.c === item.c
        );
      });
      chess5 = chessArr.find(function (item) {
        return (
          curChess.x === item.x + 4 &&
          curChess.y === item.y + 4 &&
          curChess.c === item.c
        );
      });
      if (chess2 && chess3 && chess4 && chess5) {
        // 进入此 if，说明游戏结束
        end(curChess, chess2, chess3, chess4, chess5);
      }

      // 检查有没有斜着的 5 个颜色一样的棋子
      chess2 = chessArr.find(function (item) {
        return (
          curChess.x === item.x - 1 &&
          curChess.y === item.y + 1 &&
          curChess.c === item.c
        );
      });
      chess3 = chessArr.find(function (item) {
        return (
          curChess.x === item.x - 2 &&
          curChess.y === item.y + 2 &&
          curChess.c === item.c
        );
      });
      chess4 = chessArr.find(function (item) {
        return (
          curChess.x === item.x - 3 &&
          curChess.y === item.y + 3 &&
          curChess.c === item.c
        );
      });
      chess5 = chessArr.find(function (item) {
        return (
          curChess.x === item.x - 4 &&
          curChess.y === item.y + 4 &&
          curChess.c === item.c
        );
      });
      if (chess2 && chess3 && chess4 && chess5) {
        // 进入此 if，说明游戏结束
        end(curChess, chess2, chess3, chess4, chess5);
      }
    }
  }
  //   游戏结束
  function end() {
    if (!isGameOver) {
      isGameOver = true;
    }

    for (let i = 0; i < chessArr.length; i++) {
      $(
        `div[data-row='${chessArr[i].y}'][data-column='${chessArr[i].x}']`
      ).innerHTML = i + 1;
    }
    // 2. 把获胜的棋子加上一个红色阴影
    for (let i = 0; i < arguments.length; i++) {
      $(
        `div[data-row='${arguments[i].y}'][data-column='${arguments[i].x}']`
      ).classList.add("win");
    }
  }
})();
