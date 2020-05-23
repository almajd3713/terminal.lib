

ello
so ive decided to start workin on my own library which will simplify syntaxes dat i hate

- `$()`: for selecting any property in a document

```js
$("#btn").addEventListener("click",() => console.log("clicked!"));
```

- `print()`: straight forward

```js
print("hello there");// will console.log that
```

============================
===== the queue system =====
============================

this is a system that will setup a queue for things to happen

- `new Queue()`: sets up a new queue

```js
let queue1 = new Queue();
```

- `.after()`: adds smthn to the queue

```js
// syntax: queue.after(time,callback)
queue1.after(300,() => print("wow!"));// will print wow! after 300 ms
```

===============================
===== the Terminal system =====
===============================

this is a graphical system that will simulate a terminal interface, with a lot of 