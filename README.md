# Kha projektkezdő sablon

### Használat

1. Legyen VSCode telepítve a gépedre: https://code.visualstudio.com/

1. Legyen telepítve a *Kha Extension Pack* kiegészítő
![alt text](image.png)

1. Klónold a repo-t, almodulokkal együtt (**ez lehet lesz egy-két perc**):

`git clone --recursive https://github.com/cozycapybaragames/kha-starter`

4. Töröld a `.git` mappát, hogy ne próbáld módosítani ezt a repo-t
	- Ajánlott törlés után csinálni egy saját Git repot!

5. Nyisd meg a klónolt mappát VSCode-ban és kezdj progizni! :)

### Hasznos tudnivalók

- **MINDIG** ments rá a fájlokra, amiket szerkesztessz! Ez segít téged is, hogy elkerüld a különböző hibákat, valamint a nyelv is csak akkor tudja felismerni a változtatásokat, ha a fájl el van mentve.
- A projektet kipróbálhatod, ha lefuttatod a `Debug HTML5` task-ot (alapból ez az `F5` gombon van)
- A Haxe LSP sajnos nem a legstabilabb: ha beakadna, akkor:
    - `Ctrl + Shift + P`-vel hozd fel a parancs palettát
    - Keresd meg a `Haxe: Restart Language Server` opciót és nyomj rá entert
- Néhány hibaüzenet a szerkesztőtől, néhány pedig az építési folyamattól jön: Ha olyan piros vonalakat látsz, amiket már kijavítottál / szerinted nem kéne ott lennie, próbálj futtatni egyet `F5`-el.
- Hasznos néha még a `Developer: Reload Window` parancs is a palettából, mert sajnos néha nem elég csak az LSP-t újraindítani vagy build-elni egyet.

---

Minimális pong példa:

```haxe
package;

import keeb.KeyboardInput;
import keeb.Input;

function main() {
	GameLoop.run({
		windowTitle: 'Pong Test',
		designWidth: 640,
		designHeight: 480,
		windowMode: Fullscreen,
		initialScene: () -> new GameScene()
	});
}

class GameScene extends Scene {
	final ball: Ball;
	final leftPad: Paddle;
	final rightPad: Paddle;
	
	public function new() {
		ball = new Ball();
		
		leftPad = {
			ball: ball,
			x: 8,
			y: 0,
			con: new KeyboardInput([
				'up' => { kind: Hold, keys: [W] },
				'down' => { kind: Hold, keys: [S] }
			])	
		};

		rightPad = {
			ball: ball,
			x: Screen.designWidth - Paddle.Width - 8,
			y: 0,
			con: new KeyboardInput([
				'up' => { kind: Hold, keys: [Up] },
				'down' => { kind: Hold, keys: [Down] }
			])
		}

	}

	override function drawBackground(g:G2, g4:G4, alpha:Float) {
		g.color = Red;
		g.fillRect(0, 0, Screen.windowWidth, Screen.windowHeight);
		g.color = White;
	}

	override function update() {
		ball.update();
		leftPad.update();
		rightPad.update();
	}

	override function draw(g:G2, g4:G4, alpha:Float) {
		g.color = Black;
		g.fillRect(0, 0, Screen.designWidth, Screen.designHeight);
		g.color = White;	

		leftPad.draw(g);
		rightPad.draw(g);

		ball.draw(g);
	}
}

@:structInit
class Paddle {
	static inline final Speed = 5;

	public static inline final Width = 16;
	public static inline final Height = 64;

	final ball: Ball;

	public final con: Input;
	public final x: Int;
	
	public var y(default, null): Int;
	public var dy(default, null) = 0;
	
	public function update() {
		dy = 0;

		if (con.isActive('up')) {
			dy = -Speed;	
		}

		if (con.isActive('down')) {
			dy = Speed;
		}

		final collision = Utils.boxCollision(x, y + dy, Width, Height);

		if (collision(
			ball.x + ball.dx,
			ball.y + ball.dy,
			Ball.Size,
			Ball.Size
		)) {
			ball.dx *= -1;
		}

		y += dy;
	}

	public function draw(g: G2) {
		g.fillRect(x, y, Width, Height);
	}
}

class Ball {
	static inline final Speed = 5;
	
	public static inline final Size = 32;

	public var x: Float;
	public var y: Float;

	public var dx: Float;
	public var dy: Float;

	function setCenterPos() {
		x = (Screen.designWidth - Size) / 2;
		y = (Screen.designHeight - Size) / 2;
	}

	public function new() {
		setCenterPos();

		dx = Speed;
		dy = Speed/2;
	}

	public function update() {
		final nextY = y + dy;

		if (nextY < 0 || nextY > Screen.designHeight - Size) {
			dy *= -1;
		}

		x += dx;
		y += dy;

		if (x < -256 || x > Screen.designWidth + 256) {
			setCenterPos();
		}
	}

	public function draw(g: G2) {
		g.fillCircle(x+Size/2, y+Size/2, Size/2, 8);
	}
}
```
