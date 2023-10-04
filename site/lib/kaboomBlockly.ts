// TODO: be its own package

import Blockly, { Block } from "blockly"
import { javascriptGenerator as js } from "blockly/javascript"

const ICON_SIZE = 16
const KEYS = [
	"space", "left", "right", "up", "down", "enter",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
	"escape", "backspace", "tab", "control", "alt", "meta",
	"-", "=", " ", "`", "[", "]", "\\", ";", "'", ",", ".", "/",
	"f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
]

const icon = (name: keyof typeof images, onClick?: () => void) => new Blockly.FieldImage(images[name], ICON_SIZE, ICON_SIZE, undefined, onClick)

const minusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K"

const plusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg=="

const images = {
	heart: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAiCAYAAADcbsCGAAAAAXNSR0IArs4c6QAAASpJREFUWIXVmMEVgjAMhtM+B3AD796cyFF4jsJE3LizARvoSV/FJE3SBOp/g1d+PtKQNk2wgy7n61MyblnnVF4namDNcGvUAkX5oi/QmGKQFijM08W4BGwFKz2/4FqMl3VO3PPTMJLP3h53Ho4y3ppiRpw4KM63Cqf9WisY5ZetxpoXS4T5ZQB7rnGAHvCnVuNpGD9T4h1NFE4rb6i3yJzrQdmraEao78htb0Tlj0X/Fbme9AOnXTsj1XfkJDvaPaRa+I/Wss4Jhesl7zKArFmJFBUMclr3ih61RQc4OOdqAag2OFHLGQVWplg1chHTKwEDUPStHhHkPhT7KdUdvxZSEnmqWpjPSlrbxhoYAAP3VtROWVJbRcXXE1BT8MUDvU6ONDItW9bDQK1eux+SirvKsYAAAAAASUVORK5CYII=",
	k: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAzlJREFUeJztW8ttwzAMZYoOkA2Morcci27SETJXR+gmQY65FUU2yAbuxSoUWaQeJVIy0DygQOooovjEjz400QNjMO0P87Q/zKPHsRshNFX8ersMGQfRAAK4WR9FgrvQaX8gIqLr7cIqHzCChKceQhDlR8GdAE75r7f3VdsRJLkSEMw/RVB+CyS4W0BJodEkuBGwzD5k+rlnvfDs0alGeaGPuTYrpK53vV3Yti5pBw16KT7Op9UzlARO6dKii+1cw2Lyu6aZ50jIBdR4TJq4EZMgsgt0ukuJSX9T498pCfGALQJk3B8bA0BBM5fqLOGZFVzTYG1098wKmhjQxLqFErl4oJUpuRORMgbEAqTBWc5gTg7aP5JVsgRM+4NqDb9VlGafiIkBIbKPPKjoBSkLwLlfgtZVWkwelRuDzQKLC1R3jLRNv+faa4NhDpw1i2lwsYAqN0AHHdppybJCUbmajY3XYEtyJfmcBRR3g4sr7ChDAorvn+Pd/68vn3D7UlsEUjCvXgl6zXJKljcgAlpigQYWymsnBrYAi5QoIae8t/kTNW6GrNwAVd5jFaoiwGplGCtsqXzNhDRvh2ut4Pvn6D7zyISpCfDcH/Qy+xhqArZ6xVVriSoCvLfHOZf4OJ+qlEMttSkGeJgntxbwWnjBBLSYvjafa0loIQciQGv6FpbRaAlwoEZ2g2a3PEjaq0mNyNEXB9ECcgci6Owi7XKK5Z5xwZHDUoBVlE8kEMCdA/QASkIARzZCQpYAi9vdHDTB8PXls2kzhG7euAMRE+W/3t6b01ctCej1OlQfYJnvOYWCDJSwdEwc2aXT7ZULWC91teQh7dE+EV3uTKRW+dKAkFm1uiPQpkQTAlKgykjta9FEAJEvCT2gLbNZxYClcfxnNpAe0BJvUYWlrgP0hsYNqsrkkrTiEkditF6YSmsC8+Mty0MTSzfqRgCRDQkeMQQukPAQZHmtbgmXUlmiv+JGVTyQFLeuFQxwve/TuIKg/KoYU5AXPq7kdo0BMRASOOV71Cj1emcoS0LB1+GZb0G3KjDUb0NhdA/liTq9NIWit/JEnd8blKxghPJEG3hx8j8UY66wlfeGH3iA6Bc9b+qsgyPL1wAAAABJRU5ErkJggg==",
	rect: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAKxJREFUeJzt2jEOgCAQBVHW+98Zq20USCx0zDKvRIvP1LQmSZIkbSlWH3vv/ashb4qI6T2nH6pcPs0iDA+rXT6NItwOql4+XSMc1JC/MAA9gGYAegDNAPQAmgHoATQD0ANoBqAH0AxAD6AZgB5AMwA9gGYAegDNAPQAmgHoATQD0ANoBqAH0AxAD6AZgB5AMwA9gGYAegDNZ3Kzn6tFePRQMlWJsHoqK0mStK0TRs4cUlgjqMAAAAAASUVORK5CYII=",
	pos: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAATtJREFUeJztm8ENwjAMRRPERjAB3YPOBnvABHSmcLJEQ1ugNH6R8t+NHvD3q0Rco4YgRNNEqvDjdE6vn4/3K5IFKZo3bxAS3AvONW94S9h5FqsRCaAD0EgAHYBGAugANBJAB6CRADoAjQTQAWgkgA5A07yAPVH0cLtMXh+63jmJ80YopbS4DTJijG653Ap927zhJcGlyK/NGx4SihdY27xRWkLRL/+3eaOkhMlT4NPq2put8kyt3N8ubFVs7qhby1ZHZC5hNAjVdudLkPfY/CQoAXQAmpEA6i9qT/IeJxuu7SQodQKEoEFIo7AehkoXMJp+HDZqXIi4zgExxrj0iz50vWvzIUA7QWL3N4cmQToAjQTQAWgkgA5AIwF0ABoJoAPQSAAdgEYC6AA0EkAHoNFrc94FjVpenBSicZ4f0GAqyNmV8AAAAABJRU5ErkJggg==",
	color: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAnFJREFUeJztmj8vREEUxY8/kfhTiQadQrbgm2x8A4VCREhoND4B0SioFAqlbqPWanQUopJIVBsVkQhWwWyuZ96beXPvzJC9v2o3897MO+eeO7vZWUBRFKWH6cux6PXiVqdsbO5kL+kzJVmsSrCL2IZEm5wjuowYZvRLT/jfiJKAGNU3SKdA3ICY4g2SJohNlEI4RcoEkUlSi6dwjdBNkDtBzuobOCnQBHBu/gvVN4SmoOcToAbkfoDcBPXNX+p9Ssg+MCix8NnCa+V4szUUPHdrarlyfOHhKHhuIDABO6cbrARUGeISXMX27mxtPboH1Ln44OawAwBPV7cii9MkcCpvGGnMdF9vLg16afM2wIgH5AwAgI/LNbG5qAGAnwnOC6hwg5QB7bvV7uvxNr8biwYAbhN0D6gatFWfwkkCrb6BkwJb9SllSShd0SWeg008ADxOfMRaEvvHb1Y9v1ypI7xuAsqEFwlJgisBhmISWHvA2Pws53YxfMXb0E2Qvgnpe9828I0/xbcVQhJgWoGdgNxtwIk/INQCOUwYacywxQOkBaQ+9mwtERJ/g60NJIQDX23Q85uguAGx20Gq+oYoCYhlgrR4QOgnMRvUhPZd+DwxRFN6fg+IlgDKwOjwj/fvzy/e18YmiQFFUousgv1V2Jf782bteyaHpyM8yRdiX4X/O2pA7gfIDesXobr47gMpet+gCSgbyJWElNUHNAG8cwEOthSkrj4QeDQmBTUhlnjX0VjQ4agkbxcrMaYFIHQ4SpE2Yb2x1l2/7OQmFN/jcd0EQ27iJoFWvggnCb5Vp4j8W9xlSJVgFy5DQkQriqIo33wCQy/IOUEb+tMAAAAASUVORK5CYII=",
	outline: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAklJREFUeJztm7txAjEQhhePC6ADYpM6cQVuwB24BwJX4IAe3IEbcAVOnOKYDugAR5o5hFb7FHpYX8Zwh/b/tStuhQCYTCb/mVXtADA26+15+fp4OhSJtTkDYuEx3kY0ZQAlPuBpQjMGcMUHvExowgBM/PtuBwAAb/t98j4PE5o0IAiPSRlhNeHOcrMHktRPGSMtnZiqGZAKHpv9JZ6ZUC0DtOIl13G4uQGb9fZsEZ/7XM19NyuBXIBa8XEpaMrgXjUyE86seKazBncDpKv649ODdwgi3Aywfp15xSAtA/MaYBVuzYDnl9eL11IDTBnQQ41TqAyghLcueonYgBJfZzURGUB1bT3CfhIcUTwAMwNS4r8+PwAA4Of71zmk20JmQE58i0h7AnEz1Jp4awlmDbBuNtRCErcoA1qb/YBlpwg1oLfZ15qQNKC3hS+gWQ9YJdCDeAwqC5KdE3ebGsDezVmfI1Ljxx0iAN4lXmVAb7WfQpKxZAn0/qgbwCa2+g8jpeBmwbAGpEhlwdAGcLJgaANSxFkwvAFUFgxvAMU0oHYAtZkG1A6gNsMbkGqMlgxvQEzcFRY9H8AFOwYXKNmQXfXI0t0gbT9PicaIY8mNzzlMdZUBx9NhVXpPQCse4LKmcxPDPUnG2hHKDSbJAItwK9iOEHqYgGsC1wBKPBagRzbmDk2gi6BnKVjO+i6v0cRDjZF9Mzcg58fR3Kxbz/hyzOCMQV7gvSCW+ueHFlYwXia0Jh5AcErMakKL4gGUx+QkZrQqfDKZTCYTgD/rXf8M0TdNWAAAAABJRU5ErkJggg==",
	anchor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAATxJREFUeJztm0EKwjAQRat4GBduvIQ794J4BQ/jFURw785LuHHhbXRVKME2k6TkQea/XaH98/ObpjAhXSeEaxbWG6/rw3d4ffrczc/W0szRMxUMhVMK1NLM1YsWGxO2FqihWaK3TCnUIqtSgff5MZn+P17P26yaMb0p3M+AokVwuztmFx57a7maY3rFi2BPGELJ4HtC06Waod5sv8EhOd98bTaXvXlc7tcABUAboFEAtAEaBUAboFEAtAEaBUAboFEAtAEaBUAboFEAtAEatcQswq6borFdlxzDsT5+qmZMTztDEygA2gCNFkFrAde/wSHaGWoMBUAboFEAtAEaBUAboFEAtAEaBUAboFEAtAEaBUAboFFDxCLsuiWmfYHGKT4xktJ/64nNqlTNmN4U7meAjs3lFmjl4KQQzvkB1G65CPmFpK8AAAAASUVORK5CYII=",
	text: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAQxJREFUeJztmssShCAMBInl//8ye9KD5YtHGLN0Xy2TYSpAQFMCAAAAAJgSK30h55xfBTYrjq2gSOTbwe/BA5iwqAWowQC1ADUYoBagBgPUAtRMb8Bto1La+Dwma2iMWrTc5b180Hvwb8R4arnKu/YMtuFlngfTrwHTG1A1BSJynJbbNA5RAR7H6s2QMBVQa8LTghyiAjyZ3oCqKaDY571yhqgAT8NDGOAJBqgFqNn3VtUB5mx/H6XFzGwZmfCMY+7RWh63wV5tqOeZviXv9GsABqgFqMEAtQA1GKAWoCbMjVBKPk3S5ypg9G81n6yAowncBziCAWoBam7vA3ovSC05vvSpHgAAAADgD/gBjTtkRWh5be0AAAAASUVORK5CYII=",
	area: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAbZJREFUeJztm80NwjAMhVPECJw7FDuwBUe2YAeG6pkdyqkXFBpTv+cfJU9CQqJyXj6ctHbbUob61tQ64HF7r5JA9+elGQsplK8Txk5edQ/gjAokTclo6j4DBgBvA96C7QHS0+BrWat7xXWe/jqNovYcGICWfk289vu/MDQyWQKtyWuP10iVdpK010xGmglHfG2iZoD2n7TIBBoAlHk2hBSnQSYECgDLTUyrFBlQCg9qGgAsDQDeBrw1AHgb8FYaAKwCiQLAsprTKkUGMIHSAKBMs7OJmgFa8xZLaZTDrMBdl8No06nKYZbZFNUgO10Z8WEArJog6HEgAKw7QMjx1AC82l+ocVUAJCaYFzMICKGvBCUxtBDC1wLoWN9KUw6n6Qcw/y1GbBWAb0MW1Rt6DHUGXOdp2j4IQ9Ixa9+PyOwBCbRQwEO3xNI3RDKIDiD6neLQGZC6JVYKZgJsCLSzwJ7x2ua2d/xrWdc0V4JHxS56fsm8Kbo3UQ8Ipk1RSRpb31eEvzKjBbCp9Uxxuldmot4xNimHj0weFacl2BKIqjBLIKoGAG8D3jJ/ZQYl1N7UfQZ0D6B7fQAtmNpzA7NkdgAAAABJRU5ErkJggg==",
	sprite: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAhZJREFUeJztmMtNAzEQhieIKyVAJakBCXKDLiKRIoJEF3ALkVJDKiElpIBwMkqW2J6XPeNdf7c8dtf/5/FrATqdSTMr/YDvn9OpxH2fH2YqbVcVUCpsDokMNQFW4YdQZagI8BI+QJEgFuAtfAArQSTAa/gARgJbgEX4x7uPf9/tjsvkNTkJLAG1w18LPiQmQl2Ax/ABjoQbSmM8h+f8H4AooFVSHedWAKc3OdehBXhf8ri4rYBadAHWDbAGJcBi/Od2eFrXTb4Cbms96On+8vP2kL9md1yq7ARToLbCuSEwDIcFIwFAdhYIxLbDYgHc8AGsBADeaTAQEyAaAtLwVLgTY4rsJBjr/drhSzH5VcBUAGX8l8JMgIfwAAIBkgBewgMIV4HtgbfB8YR4J9ha4CHJjZDnlyCb/Sr622K+vviceinalIBU6GsEEc0LoAY/ZzFfJwVUOw1ykATHEhVg2fuawXP3QlcAplHDyYdKjR4fkhVAaVT4L1WERfBAcifIbRhHmhXFJsFcNdQK/vnynlzpohWg1cBr97Hu9XOqnAY3+9VfaE/hASofh72FB+hvhLqAyQtILhGvX28uDkNccksgQK+ALiApAFNCrTPaCsB2XlbA2KsAVQFjlkAK1sqySOkw0hwwxkpgBfJcCdROYveoRwmcClUpaQ8yuMNTfUxbyJDMTUUntRoypBOzyayuJWaMq1KnNr/Zxdmo4ktaEgAAAABJRU5ErkJggg==",
	body: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAd1JREFUeJztmj1ug0AQRr9EuQdlFFGhNO7T5ACuUkRKmTPQ0HCGlJZSuMoB0rinsVJFlsuchFRIsOZndtlZD8u82mZ3vnkLKxZAURRFURRFURRlhdyEGuh8qGrb/9w/bdjnxz6AS+F9fH58AwDKr8LrnG99XoyT1/dnAEC+LbwE2uDdAF8d76OxwGSOFYsxYIx8W9SuZsw2gLPjJkMGtLG1IQoD2tia4GxAyM4DtO6bUGyIzoA2FBusAzgfqjp09+cwFULUBjSMhXBHvcg1u+6y/qmswgBg2AJSALF2HxBugO/i+ywQGwBX580QRAbArX2byQD25a4+Viccq1OI+QQtHpgIYF/uOrpwhxC6eGBkH2AW39AO4XHzwDClsPQGMFS8CdUISlChlpjJRQDU4m2gFpdmCX5//nwPP0rnHsBRvC1pliDNkmDjiXwMAuGCEBtAA3cInQBe8rdgByVSuDBgbSH0LgFpIXAug8F7gLQQfGG+KB29CcYaQhtSgRL2BwBmbZKGXpGLfwxyQ1ZcggUuBkwdjqzeAA2A+kMJTwSO/YCVARJCsGH1h6MUyEdjS8DlUxlrA5a2DKZwLuYa+4KhfcBVPpKKxYTZRYQygStwlov6CCUWwxRFURRFMP+z46mzM2/VqwAAAABJRU5ErkJggg==",
	offscreen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAgRJREFUeJztW0mShDAMU6j5/5czJ7oYlsbYkuPUoCsdx1JMvFANvHjxr9EyN+u996drWmtSH1ME8BDfQyWEVAAG8S0UIsgEYJPfgimERAAl+RUsEegCZJBfwRCBKkAm+RVREWgCPCFvcZpt73Ktd+EWVmc9jlpsDxVA7aBlj4j9xbvQCspFJawGpQKoy1gGwgJckZyBPECKgD1ZNnllev1hGZrlxPco77QyAwAJWSCClJ5CvYEHysLqYCNqgI1M8kAxAbLJA4UEGEEeKCLAKPKAQQB1GmKQ/2bjzr+vD9U9uZq8ZX3I8JONPPbv7DEO6LQQ8hYgzMIlq584CBAlUfkjyJlvy90PWBspwLh3lqsHs4A2FX6a7qKXWCR1WWDlY+oGzxyatf/fI9QOVxbB6ttHAM9sb9Z7Y4s/EaCe7VXEYSZI67PvavDW2lkEZYvuHoqyCp6tnYzbfw/aVNgL1ol7D0QyFM0O46fkt/65BKh0+0fIA8XH4neIkgcEAmSFP4M8MGkEsMgDgizQe+8VCiirD8PTILsOeGrDvSFjWhypBFlV5LA74EpA76TYGz3uV+Cqls8E45WRzAMqXIJW0Ovw6LeBbPGGn5RVPHa2+NhiGVJCGSlyAaInp54eS9Pg3vnRWeMMMgGieT4L5ZshdaotLwCgnVan/2usWpFUPgu8ePFCil+JPTSzvI08gQAAAABJRU5ErkJggg==",
	burp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAddJREFUeJztmrtxwzAQRJceleNWnLkONaBEiRtwHc7UivqRI8xwbNDEZ7F7tLAxR8A+4Q6HA5b7+faAUK+fb4tyvD29qAdUA9+THAAQC4IFABAHgg0AEAOCFQDgh2AH4NYE4J4A4A2DEAAAH4QwAFyaANwTSHKdEUIAcB6QTq6Bk0aYv7xffyXUj69rdpzFlX1bjOeMJSWDJd+sJQfANl6rnxCkOcBtPidJDmiN89HmgcEAehKcwjwwMAQims8lwSEAojU+ge1tkB4C0cxvGU+irgCl+T1jpd/Q6gC2+a08UGKqRpQVMOKfzxllmwcIKyBazNeqawUc3TzQuAv8B+NJ1QBGmy8pgpi5wN4PAOorv/Q9A0RTEmStAkbJ2wuhKQkyagdWvd/7O5ZtcMRhp3UldBdC7svNpFaolErwyBCoPcHScFA1O5L+Cg96U5QJYT3xXmjStngPhL1k1gPC0hZXXXyUSNYSW+t+vj3YkJmlsOxegA2CBeHQDyVrIIS7GwR0ZwrpNlgrd2/BDiDpqR9IAPORFAAPhFAAAD2EcAAALYSQAJSaANwTcCskAGVNEBKAUhOAewJuhQOgPhOEA6BWKACOE2EoAA6FAfDU/QBnV8gOwN0S+wZsQOzxeg2q9AAAAABJRU5ErkJggg==",
	destroy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAjFJREFUeJztmT1SAkEQhR+Wd7GMJSDGxAMYGVBl6BlISPYKGFpFYMQBTCQ2sMrIwNAzcABMHGqgZt356el+i/sioGqX/V6/7hkGYNCgf62R9QOk6Ll52rnXd/N7kWfvjQE+vJOECWelN9BQCB4Avl7fgp+niD4BbfBXk8v964vrSTYHdQJi4EtFm4BU+NwUUCZAo/JOdAa0wdcSVQv8BR9T/Zw2oElAKXyuKAywggcIDLCEB4wN0B54IZkZ0AWvUX3AyAAWeMDAACZ4gGAI+tKGB5QNsJ74IakZwAgPKBnACg8YzwBreEDBAK3NDuV5AHP0nUxagAUeqHgeoHmqc7KHojEqgQcqGaBZ/VL1KgHbZolts9y/L60+oGhAafV98G2zFIEHKhgQir8kvLToWyAEP96sxFYv0WVQuvq14QHgXPJmpeqKujQ8INwCnx/fB+9Tqm8BDwi2wPx2cRD/2cNN9LVW8ICQAcfwTjEmWMIDlVeB1eNL0fW14QGBBLRV31dXEjSmfZtU9gFdSfBhx5vVSAseKExATPVDatYLmr/lsxOQC88m+q1wbQ0G5Fx0KvEHDBLQNgDfp7Pd+3SmbixFC/jg2iaoGhCqvkXVfSUbULv/NTdBgGICmDY/vpIMqFH9422w9P27pHIi1FV9C3AnilXAUoMBtb+Adfg5JRnADpOjLKDY1SDGMLcRshqE2V/aZUIKvJOFCdkzoFkvRm2QfWqV4n1An2ApZfUzeNCvfgDaKd7O/66npQAAAABJRU5ErkJggg==",
	scale: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAPBJREFUeJzt280WgjAMROHi8f1fua5cAknsONXcbys2Q8TyYx0DANDXEdlozjlTgx5HaNwsRY7bDbJFM8UzVDkuX6wWjRaPUuZ4qIru5GpfThvQhawBK+cA1aQ6hqgBisCqJjwrb1J+Ip/UrcxbzAHuAG40wB3AjQa4A7i1b0D6vOq6BojKZk7dDu++82+/mBkAAAAAAAD4kvbPBHkqnBkoMqBTJXP7H0ZogDuAGw1wB3CjAe4AbqVlcnfL0XZZLR4hOQIUQVVrl2VfgZWBlQu3288Bpw3Y9Xq/YtkSmVVFKyz/GKkW3+Us8E9HMQBIvAB/SHQ/N6bnNgAAAABJRU5ErkJggg==",
	rotate: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAbRJREFUeJztmkmWwyAMRHHf/870ynkOIRiJqkJJ9Jf9OhrKIMRQSpIkSZL8LAfbQa21Wn9zHAc9rocvhlFP0j0UQkAdoBLvwRIDYpSZeAtaCLcxZdItSBFchnYmf4ISwWwkQvInCBFMBlaSnwl2x5JJFcAbnMpPKSQBkEWK7RNaA5iNy50QMgHaYJRtK0N8WfAIGKPgzx/OdxBuBNxNL/Q0CDUC2uSsy6GnjwgjwLvg2Z1nGAFGMFedjxCASRgB7r6sdyrUC12/HqOjgFaGKGK+n/5n4wu3F1Bst6/xUbaorRMrbBGmBEAORw+qA9ZugEjn0US4rQEKpxbYH+PpD1HP9ZnTUSbAKIgZWMVYKkApGhEsPqZrwF2DYYEhAvREaLT5mNmPs87vGNAORT9FhDCboV1ABdh1WrwCdQS8XXsDiWMWwBr8S+sZKPlSSNfj0ZIc8fNFkNKV7bou8/iltaW7LkrNNYoRxJOD4FflS8F9w4OJ5a/DetbCfo7z+F+vkyuKbfQsshrQEkEE6SrQY6cIYV6IKEWQvxO0EPWA9cUWytAIlBiM5kq6aWEtmUmSJEmSuPgHlqQwQTfOyUoAAAAASUVORK5CYII=",
	timer: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAApdJREFUeJztm71OAzEMx13UF+BJAIkdqSyVGG8v7wDq0CdgQPQdyt6xUheQ2Cu1fRJeAKkM1UFIncTOl3Ncftu1l4v9txO71zuASqXSZwbUE78+Xw7q8fD8kTw2NbptLRQbSU6YJuBMlAqXbQB2+5yGUyZwTZIKqm0tmI1nsSbgGiMBZqNRgC445IPulzFtfQTYNXsfm4K4XF54jWuXA5oBXYp+qOjWPYCDRPRjzH0iQFdSP5YNw1gTf0wXoZfy4ub5/o8t3D0hSIBdsxdzvOVk/uYoCFWIkypAWQLSUXehZoVJiLYKoGXQJoLJ+bdZ8+d4tV2SjL27+h1HHaMyX5u/MwmhdoToEhiePw4wEUzOP4wB3mZUk+OgCgdwFE8X42O6+BFh1+zh+v31JOCoAJvR5GDaVTHnS+FhbM+IzWhy0EVgbYI2533SN2RcLLyrgHTkTcK5skAnWifYVcgCqOkvHf2Y1AyQNkAar00Qq8FdJfjHUAnoAbl9ogckiQCh7W1OvATgOMUVQ48mdz4uWZdA61xsh/TriTdCLgexKNs+T0myMrjaLq1C3F01JIdT7yHifYBE1FWS7wFtBG2Omr7LUUGyNUKr7VI82hhZqwAlG/RzKYQ0QiJ7gMu5nM2T2CboqhK5SN4J5rhWcY1Ql6gCSBsgTRVA2gBpei9A7+8J9j4Dei+AeCcYg+w/hjitZul4L4H/IkLQ/YD5Gv+jlHMrnHKuq+qox9zAkDNAfd5GpaRM0G0x2ayCCoA9S2O7YAki+NoQrQzO13JCYPNiwcICa33JYTOaoI/Llfp8IIA97dkCAJhFAChTCJMApmVNes2lKyJwnQdgvDVmE6FkbM4DMAQA6J4ILucBmAK0lC4ExfFKpQIAAN9qny7f/5Nf/gAAAABJRU5ErkJggg==",
	key: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAbBJREFUeJztmqFuw0AMhrNp7zE4MDRWPrIHGBqYNLhnKCnJMwRWCijaA4SMl0xB0TSYJ+mQqyiN7+z0Et/5/MEoOvn/zjknUorCMAwjY25CLPL3fTyFWOcaHp43s7JcJSCG4GO4ImYLiDE8wJEwS0DM4QGqBLaAFMIDFAm3nAVTCk+FJSA1KBt2F3KxIXXVTF5//3zhLBNsHQxSBxzKfbKt76vdKyDl8IArg1OAhvAAlkX1IUgBFaBp94GpTJNTQCL80qc9cCj3p7ftx/kFyR6B8QWNrT9mmNE6QLoAabIXQP4WCMVapz2V7DvABEgXII0JkC5AmtWnAHbaS02H7DvABEgXII0JkC5AmtWnAIbUdMi+A0yAdAHSmADpAqRZbAqEOqWj+Rb4Of4uWYcY2T8CLAGpdQGlXnYHpCKBWidbQNf26OtpLNRVU3RtT7qXJWC4aF01UYrg1kQeg5jRGCUAXdsXj0/3zntsClBuoj5PMeKr3Ssg5fCAK4NTgIbwPrI5A7DNRAVo3H3I5P1JSmN4jAsBQzsaGedDw25fd+r+Fiu/dhd5nbutScJUeMMwjH+EtJ6UruLXVAAAAABJRU5ErkJggg==",
	cloud: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAS1JREFUeJztmNESgyAMBAPT//9l+pRpalFBAinJ7RvojNwmrQgRAAAAAACISbJ8eCmlXF1PKU1fn4mAu+BHZopYJqA3dI0ZIqYL0Agu0ZYwVYB2eImWiGkCZoZnNCRMEbAiPDMqQV3AyvDMiISsuRArRqSrdoBF9SVPOkGtA6zDP8XFT4B5UgQVAbtWn8hZBxD1F+O16kH/SpcAL6ElTQI8Bmdu35s7h2/ZF1zesHN4yZWI0wtewjNnEqqT3sIzNQk/E17DM0cJXwPv4Rkpwd1OsAVZ6FybjETIDiD6FDzLQUTCdgADAdYLsAYCrBdgDQRYL8AK3g5nOYhIyA6QBQ/3NXj5OUzkW0LTgQiRTwldR2JEfiTc/cG7PhUePhZndhMR+bUOAAAAAAAAaOMNO4uEInQPNi0AAAAASUVORK5CYII=",
	shake: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAi5JREFUeJztW0tuhDAMNVUPxDlYjnqbbthwG9Rlz9Eb0VWkTEiC7dgGB95ylDC85288GYCbY5B4yDS+tvSz378fkWdrg/2SOdIpPIjwSd2AIe4JJAtRyHuwPgBSgF7cPYfDl66R90o6RpVAiXwPxAOKRO5AHqAgALeuh32eREIJcETIcyO06wOodZ7TF3x/zdk9yzqbi7b7Qor1qXmiRDyFpRAf3I1a5MNayvoWvIUA1p2pMW9FhoOqB+RIWZK3EI4dAgHaltcWgSQAJeNLvrimCE0eIJHwsNASoTkEvOMR4OwXOBuPAJTFcdLzctg5Anko2gvxgNuHQLHVbbW0dN3WOiGqurOkCC4FAJARQXM+YJLQWkTQHo6YZXSOCBaTIZMqcOWByOVzgOsQkLK8yyR46z5AK+ZbRcg1eeICaCc8rgil3ztEqwCGfKsVpQU2PQwdkZeI82l8bZThLfk4zAWWXLyOau2Y+DS+NsyBTtQDSiTP+NETC/EQSMlKk5d+nkoISL3kss5DHAYanmSWA7jQDp9uRmLcC5xdCNByRcdcgFpp4zQ5rfeTTAXAEMSKUGp4qMPcS4/ESgmQej2nJpS6B1hNgyiWj9eqCtBKvrQ/Jcu5yRbgYiAidQQG2It12kAkJXW0hyoCNkF20QekoFQHcwGWdR5y1pRqeaml0cVABCMOty8wE4AzEMHsq02AMKXxsoMKDCT+ztNlEqQ0Ra49AODdC3q7vvPgwQN9/AM971JfOLy3NwAAAABJRU5ErkJggg==",
	mouse: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAhJJREFUeJztmT9SwkAUh5+OQ+kV7HDAyqGh0cYjOBRY6TWUhoJz0EnFEWywoWGslNHOK1jaYKGbWZf9v7+wG31fhUhe8vvystlkiRiGYRiGYRiGYRiGYf4Ze7Ebbh4/NlWRs8PoOrmJOnA5fFWooRKCD1oXvir2I6FJ3QEVMFvMaXh+ub0Ti4T7ydRYT+Xq7gYuEybAFJ7oW0BIUBdIEd6F5AAi6Gwx//UbnQD1N0gQIpwFQs+cSU5dpEqwbqwLP7y9JiKi0WBMJ6dHKfuGkSIhaHAS4QUlSSCKE7Gv+9I20pdMzEC7JUCE1w1oo8FY+7kkQiVstYwQYBrEnp/eq88ltb+K7+UAmaCUio8E+G2wNFwStINgSIGmEzUTRNPrd6z/Xy3X0bVdJzDq7CJkuELriBFRiwCZUBkxwVVCRCSPASh6/Q4kvKjlg+npVAYywJm6ABXYhK0T5PC29xGwEV6VUHd4gU6CaHufN1PQW9z9ZLoR5t8+X5ClrcgS1GveJeEAdRDqA1S71YVJaLe6ROSWGjNngQio6+lRBJf/ViWsluukyRqsA1TUdnt9WAZJUsPLHF/0d/9O0AX6VThq7cF1XEXP81Ol+mxf2yWAYBeLKkV3QAq+3VOkAORdxdVFRQio6zbqcwllF5AzPFFmAabwu1xRziaglCX0LDsuJTxRBgElhc9GU5feGIZhGIZhmL/EF3cI8tGO+6W7AAAAAElFTkSuQmCC",
	mark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA0CAYAAADfRPtlAAAAAXNSR0IArs4c6QAAAedJREFUaIHtms2NAyEMhd+MUsB2sIpy27ZSV9rKbbVKB+kge5qIEAP+YzBS3imKBuwPM4wxLDDq++vnYe2jpdv9umjbqhvuAZZLA6oCHAGXSgIqAvQE+/07P3+fjhdxey4kG7AFlzrspRY4B7L5wAiwXBbQKmANbg+wXDXQEmQRMBpcqhIoBUkCRobbxIVkA0YBS8WBfAOcBW5TC3JtdRAZDij7twVqpf6cTbUgvEzRHHDkp0Bjm5quzwhGiF7qoCZ9owal+A5yR/B0vKic2UvNRaYm64jnSgfV6/U4ADGm5ybv956MINdIjxH31sEavahgm94iGN1hqUyLzAz6AM6uD+DsmgKQmw5Wk+2osqSDt/t1CQ3okd+GBpSoNBhhASmHJVkWuybDcWT0frBmP9R+sNaXJnoAAWhx1APSezasltNTSj0GqBa9lr0FsFXTagYkdR1NH1Q7snRvrWb3WmRaPuR2qdno8pnosUmWwpW0ArZbDFyHJP1o+ioxFCOoLbxaQD3e2VzV0r3E6F7iLCypwqZqlDSzaprzQcmxdSrREfYoUC0coLiEsDekBQ4Ifo3ECgc4XAQC/GE192FKYj0sOb/QwnJWyK63DUcfsWmzrfDXKa1ppKlxb1CPHNl1s2sF9t58A8A/00UHqR2QHnEAAAAASUVORK5CYII=",
	gravity: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAjFJREFUeJztWcuxwjAMVJjXDj3RCCcaoScK8rsQxmRiW5K1kjJkjxDrs7Y+lolOnDjxy1hmBZRSypfAZZmW6YkpY7fOfwlWErHK9CJSraTn/Ee40Ik9mWgipnaJpYDpwEgmigixUInzHyUD47kyESRcrAVKISFUQ/4IoQS0Yn4Fd80MwgjgJLwWEZYkuBNQ3tj+3otvZCVwrQKtddJKYUmIax8wSwAC6hAYGc11PhoudwFE12gFuFJE12gJqEJE12gNiLLZePckwVyRVbLzIiH8LtCCV9UwJSBrqesh7Qkg8iE0NQFEfBJad4wR0hNANCah/l9KwiEIIGrv8GyYQAlAlLKaCIshKvwEoOq51QTZjADEG4FkrVaHye5wd0Marx7zBMjLUM8gixF4LWM2xMxHYhyDoh5BdnVJF1jGeoaHVbMkeLRX4RViAriz+6PgT7PoyA5vcZhWGIWTgGgDakQMVMJjOfrNIJwAolgSUoRAZFVJcQJWZHw83cX9+iz36zPNBHjGHjGzW0WP1y10d2btSZEDInE4ArjHnfvdkABJfKFzQy27p4f7HdGAAIlCidLeWgn21klldRPGzG5ykpEmgUltGsnsngBthkdWBolszrfDHCB1xqMscnRw7WAbOzp6Gsctegq3PuDxui0t4VyliIpS69YQqDquq2EShXs7xflNqkcKtzYWXVG0cO3jNSSgk6r7RUZCgkdFCbnJISqKFqmuskTx12t3ZBuunPg1/AOiXJF4B19Z+gAAAABJRU5ErkJggg==",
	collide: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAllJREFUeJztmb1OwzAUhU8RIwPqCyBVTAy0oD4BIxsNMy+ChBASL8JM6cbIE1SQMnRCSH2BqgM7DMjFMY4TJ9fXLtxvoaVN6nPu8U9sQBAEQRAEQdgsTgejT4r7dChuwo0p/jF/aKxju31z+KCqus7GJKBKfNMUJG+AT9WbmLDlewEnISJvkmQC2gj3TUFyBlBU3ceEZGYBjrjbSCIBIcTXTQHrIDg9uSgIPR2MPkNVvu592QxQ4tXfWJE3YekCZuUB4Gr5wfHTlV0heAL2dg9C/4STqqQFN2B8PLQ24Ka747yu6nMfXCaQdQE95tnztLNYzX9FfzDuI89mheuulh9OsVRdpawrkBhg6+Mmg3F//do0oQzqccJmAkkXGD7dJbGeqMLWFUhWguZAp6qtKq1X3/Zep246qCAxYLGaI3tGxxzwXEJtcIsHCGeBxWpOdSsAfOuEIA9DeTbzrn5oymYB0nUA1WDIMfornA2+PL/2Wq+fLd8L731SoPf/0HO/TmkCfMWbxO4CdR+HycYAvfoxxftuiZEYYEY/Bk23xckfhppWX7/O90Eo6smQWX3OKbCNcEVrAybdHoCiEeaKLoQhFOIBxzTYdhYA3ANjnWWvbTqkEq4IuiGi0gH8CM6zWeM1P7V4gOFcYNLtrZNg2wypQwjhCpZdYT0Jrv/ZCCkeiHAypAs/2j/Ey9ur9XuhhSvYDCiruM0ELvFAIsfjR/uH69ec4oFEDAC+TdCN4CIZA2IhBsRuQGzEgNgNiI0YELsBsfn3BpBui7fl9v56Iw5ZBUEQBEH4G3wB+SPkYjlTNbQAAAAASUVORK5CYII=",
	grounded: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAhJJREFUeJztmL1uwjAUha9RZ4ZOiI29Q5eOzEiVOtCXYKvUJ6nUjadg6MTM2LV7t6pTh7yAO10UjOPY106OBfeTkALxJecc/8QJkaIoiqIoypVicv/g6+XDxrS7e3/KvtYQZImKNc/UGIJYUKp5prYQRGKk5pmaQkgWkmueqSWECVoAmuQA5ovZEDpgiEbAfDHLCqKmEG9yitnIz/dvUvuayAqAqdFYLLoIogWg0QDQAtBoAGgBaJL3439vn0WeBUpy+/ogfq64iBGQ0ykXEQCRPISzoWMPjSUiMsupd1ilXmi725/9tlmvkmtja3zTIeTJ+BoeT3oKUgLwmWdChqR1TDuEPk/BKeAWpxAyETovrfMRo/8kAF+PS0KIFem2k9bF4vN3NgK65n4Om/Xq+JHUSojtuEHuAm3RroGUc/zdDU8SSlfHdvZ218pZ40bIhRfBvjsaUeCFyBBTYWxiPJxMAXtobM7KPwTb3V686PlwPU7aJ3zHJUk1026bG4JrnI87p4A9NLbkNPCZ6VrMSvY4UbhDjwGY5dS4DUuH4JJitPTtkH0NshHyITWQU9tnnmikjRAz5kbIh1lOjesPtg/oG/5S4+7TYN9eQNTbtW6GJG+GxMO9thCkr8XM4/1zVUbG5mJeiUnRANAC0GgAaAFoNAC0ADQaAFoAGg0ALQCNBoAWgEYDQAtAowGgBaC5+gD+AV/F8zTh/nRTAAAAAElFTkSuQmCC",
}


const colors = {
	kaboom: 250,
	obj: 250,
	component: 200,
	action: 180,
	loader: 320,
	query: 220,
	event: 130,
}

function getVarName(block: Block, field: string) {
	const id = block.getFieldValue(field)
	for (const v of block.getVarModels()) {
		if (v.getId() === id) {
			return v.name
		}
	}
	return null
}

function getExtraBlockState(block: Block) {
	if (block.saveExtraState) {
		const state = block.saveExtraState()
		return state ? JSON.stringify(state) : ""
	} else if (block.mutationToDom) {
		const state = block.mutationToDom()
		return state ? Blockly.Xml.domToText(state) : ""
	}
	return ""
}

function mutateBlock(block: Block, action: () => void) {
	if (block.isInFlyout) return
	Blockly.Events.setGroup(true)
	const oldExtraState = getExtraBlockState(block)
	action()
	const newExtraState = getExtraBlockState(block)
	if (oldExtraState !== newExtraState) {
		Blockly.Events.fire(new Blockly.Events.BlockChange(
			block,
			"mutation",
			null,
			oldExtraState,
			newExtraState,
		))
	}
	Blockly.Events.setGroup(false)
}

Blockly.Blocks["kaboom_kaboom"] = {
	init() {
		this.appendDummyInput()
			.appendField(icon("k"))
			.appendField("kaboom")
		this.setColour(colors.kaboom)
		this.setTooltip("Start a Kaboom game")
		this.setHelpUrl("https://kaboomjs.com#kaboom")
	},
} as Block

js["kaboom_kaboom"] = () => {
	return "kaboom()"
}

Blockly.Blocks["kaboom_burp"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("burp"))
			.appendField("burp")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
		this.setTooltip("Burp")
		this.setHelpUrl("https://kaboomjs.com#burp")
	},
}

js["kaboom_burp"] = () => {
	return "burp()"
}

Blockly.Blocks["kaboom_loadSprite"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("cloud"))
			.appendField("load sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
			.appendField("from")
			.appendField(new Blockly.FieldTextInput(), "SOURCE")
		this.setColour(colors.loader)
		this.setTooltip("Load a sprite from image")
		this.setHelpUrl("https://kaboomjs.com#loadSprite")
	},
}

js["kaboom_loadSprite"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

Blockly.Blocks["kaboom_loadSound"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("cloud"))
			.appendField("load sound")
			.appendField(new Blockly.FieldTextInput(), "NAME")
			.appendField("from")
			.appendField(new Blockly.FieldTextInput(), "SOURCE")
		this.setColour(colors.loader)
		this.setTooltip("Load a sound")
		this.setHelpUrl("https://kaboomjs.com#loadSound")
	},
}

js["kaboom_loadSound"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSound("${name}", "${source}")`
}

type AddBlock = Block & {
	itemCount: number,
	hasOutput: boolean,
	addComp(): void,
	removeComp(): void,
	setHasOutput(has: boolean): void,
	updateShape(count: number): void,
}

Blockly.Blocks["kaboom_add"] = {
	itemCount: 3,
	hasOutput: false,
	init() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage(minusImage, 16, 16, "Remove a component field", () => {
				mutateBlock(this, () => this.removeComp())
			}))
			.appendField(new Blockly.FieldImage(plusImage, 16, 16, "Add a component field", () => {
				mutateBlock(this, () => this.addComp())
			}))
			.appendField(icon("mark", () => {
				mutateBlock(this, () => this.setHasOutput(!this.hasOutput))
			}))
			.appendField("add")
		for (let i = 0; i < this.itemCount; i++) {
			this.appendValueInput(`COMP${i}`)
		}
		this.setColour(colors.obj)
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		}
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Add a game object from a list of components")
		this.setHelpUrl("https://kaboomjs.com#add")
	},
	setHasOutput(has: boolean) {
		if (!has && this.getParent()) return
		this.hasOutput = has
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		} else {
			this.setOutput(false)
		}
	},
	removeComp() {
		if (this.itemCount <= 1) return
		if (this.allInputsFilled()) return
		this.itemCount--
		this.removeInput(`COMP${this.itemCount}`)
	},
	addComp() {
		this.appendValueInput(`COMP${this.itemCount}`)
		this.itemCount++
	},
	updateShape(targetCount: number) {
		while (this.itemCount < targetCount) this.addComp()
		while (this.itemCount > targetCount) this.removeComp()
	},
	mutationToDom() {
		const xml = Blockly.utils.xml.createElement("mutation")
		xml.setAttribute("itemCount", this.itemCount + "")
		xml.setAttribute("hasOutput", this.hasOutput + "")
		return xml
	},
	domToMutation(xml: Element) {
		const itemCount = xml.getAttribute("itemCount")
		if (itemCount) {
			this.updateShape(parseInt(itemCount, 10))
		}
		const hasOutput = xml.getAttribute("hasOutput")
		if (hasOutput) {
			this.updateShape(JSON.parse(hasOutput.toLowerCase()))
		}
	},
	saveExtraState() {
		return {
			"itemCount": this.itemCount,
			"hasOutput": this.hasOutput,
		}
	},
	loadExtraState(state: any) {
		this.updateShape(state["itemCount"])
		this.setHasOutput(state["hasOutput"])
	},
} as AddBlock

js["kaboom_add"] = (block: AddBlock) => {
	const comps = [...Array(block.itemCount).keys()]
		.map((i) => js.valueToCode(block, `COMP${i}`, js.ORDER_ATOMIC))
		.filter((c) => c)
		.join(",\n")
	const code = `add([\n${comps}\n])\n`
	return block.hasOutput ? [code, js.ORDER_FUNCTION_CALL] : code
}

Blockly.Blocks["kaboom_destroy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("destroy"))
			.appendField("destroy")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
		this.setColour(colors.obj)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Remove a game object")
		this.setHelpUrl("https://kaboomjs.com#destroy")
	},
}

js["kaboom_destroy"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	return `destroy(${obj})\n`
}

Blockly.Blocks["kaboom_sprite"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("sprite"))
			.appendField("sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a sprite")
		this.setHelpUrl("https://kaboomjs.com#sprite")
	},
}

js["kaboom_sprite"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rect"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("rect"))
			.appendField("rect")
		this.appendValueInput("WIDTH")
			.setCheck("Number")
		this.appendValueInput("HEIGHT")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render rectangle")
		this.setHelpUrl("https://kaboomjs.com#rect")
	},
}

js["kaboom_rect"] = (block: Block) => {
	const w = js.valueToCode(block, "WIDTH", js.ORDER_ATOMIC)
	const h = js.valueToCode(block, "HEIGHT", js.ORDER_ATOMIC)
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_text"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("text"))
			.appendField("text")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_text"] = (block: Block) => {
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return [`text(${text})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_pos"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("pos"))
			.appendField("pos")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_pos"] = (block: Block) => {
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return [`pos(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_scale"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("scale"))
			.appendField("scale")
			.appendField(new Blockly.FieldNumber(1), "X")
			.appendField(new Blockly.FieldNumber(1), "Y")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scale"] = (block: Block) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`scale(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rotate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("rotate"))
			.appendField("rotate")
			.appendField(new Blockly.FieldAngle(), "ANGLE")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set rotation")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotate"] = (block: Block) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_color"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("color"))
			.appendField("color")
			.appendField(new Blockly.FieldColour(), "COLOR")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color"] = (block: Block) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_color2"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("color"))
			.appendField("color")
			.appendField(new Blockly.FieldNumber(), "R")
			.appendField(new Blockly.FieldNumber(), "G")
			.appendField(new Blockly.FieldNumber(), "B")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color2"] = (block: Block) => {
	const r = block.getFieldValue("R")
	const g = block.getFieldValue("G")
	const b = block.getFieldValue("B")
	return [`color(${r}, ${g}, ${b})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_anchor"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("anchor"))
			.appendField("anchor")
			.appendField(new Blockly.FieldDropdown([
				[ "topleft", "topleft" ],
				[ "top", "top" ],
				[ "topright", "topright" ],
				[ "left", "left" ],
				[ "center", "center" ],
				[ "right", "right" ],
				[ "botleft", "botleft" ],
				[ "bot", "bot" ],
				[ "botright", "botright" ],
			]), "ANCHOR")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set anchor point")
		this.setHelpUrl("https://kaboomjs.com#anchor")
	},
}

js["kaboom_anchor"] = (block: Block) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_area"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("area"))
			.appendField("area")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object collider")
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_area"] = () => {
	return ["area()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_body"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("body"))
			.appendField("body | static")
			.appendField(new Blockly.FieldCheckbox(), "STATIC")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object physics body")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_body"] = (block: Block) => {
	const solid = block.getFieldValue("STATIC").toLowerCase()
	return [`body({ isStatic: ${solid} })`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_outline"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("outline"))
			.appendField("outline")
			.appendField(new Blockly.FieldNumber(1), "WIDTH")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object an outline")
		this.setHelpUrl("https://kaboomjs.com#outline")
	},
}

js["kaboom_outline"] = (block: Block) => {
	const width = block.getFieldValue("WIDTH")
	return [`outline(${width})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_offscreen"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("offscreen"))
			.appendField("offscreen | destroy")
			.appendField(new Blockly.FieldCheckbox(), "DESTROY")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to define object behavior when offscreen")
		this.setHelpUrl("https://kaboomjs.com#offscreen")
	},
}

js["kaboom_offscreen"] = (block: Block) => {
	const destroy = block.getFieldValue("DESTROY").toLowerCase()
	return [`offscreen({ destroy: ${destroy} })`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_fixed"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("fixed")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to make object ignore camera")
		this.setHelpUrl("https://kaboomjs.com#fixed")
	},
}

js["kaboom_fixed"] = () => {
	return ["fixed()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_moveBy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("by")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveBy"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.moveBy(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_moveTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object to a position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.moveTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_scaleTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("scale")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Scale an object to a scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scaleTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.scaleTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_rotateTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("rotate")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("ANGLE")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Rotate an object to an angle")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotateTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const angle = js.valueToCode(block, "ANGLE", js.ORDER_ATOMIC)
	return `${obj}.rotateTo(${angle}})\n`
}

Blockly.Blocks["kaboom_setText"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("set text to")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Set text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_setText"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return `${obj}.text = ${text}\n`
}

Blockly.Blocks["kaboom_jump"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("jump")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("with force")
		this.appendValueInput("FORCE")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Make an object jump (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_jump"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const force = js.valueToCode(block, "FORCE", js.ORDER_ATOMIC)
	return `${obj}.jump(${force})\n`
}

Blockly.Blocks["kaboom_getPosX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("x position")
		this.setOutput(true, "Number")
		this.setColour(colors.action)
		this.setTooltip("Get object X position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosX"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.x`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_getPosY"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("y position")
		this.setOutput(true, "Number")
		this.setColour(colors.action)
		this.setTooltip("Get object Y position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosY"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.y`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_isGrounded"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("grounded"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("is grounded")
		this.setOutput(true, "Boolean")
		this.setColour(colors.action)
		this.setTooltip("If an object is currently grounded (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_isGrounded"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["false", js.ORDER_FUNCTION_CALL]
	return [`${obj}.isGrounded()`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_mouseX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("mouse"))
			.appendField("mouse x")
		this.setColour(colors.query)
		this.setOutput(true, "Number")
		this.setTooltip("Get mouse x position")
		this.setHelpUrl("https://kaboomjs.com#mousePos")
	},
}

js["kaboom_mouseX"] = () => {
	return ["mousePos().x", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_mouseY"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("mouse"))
			.appendField("mouse y")
		this.setColour(colors.query)
		this.setOutput(true, "Number")
		this.setTooltip("Get mouse y position")
		this.setHelpUrl("https://kaboomjs.com#mousePos")
	},
}

js["kaboom_mouseY"] = () => {
	return ["mousePos().y", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_width"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("width")
		this.setColour(colors.query)
		this.setOutput(true, "Number")
		this.setTooltip("Get game width")
		this.setHelpUrl("https://kaboomjs.com#width")
	},
}

js["kaboom_width"] = () => {
	return ["width()", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_height"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("height")
		this.setColour(colors.query)
		this.setOutput(true, "Number")
		this.setTooltip("Get game height")
		this.setHelpUrl("https://kaboomjs.com#height")
	},
}

js["kaboom_height"] = () => {
	return ["height()", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_gravity"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("gravity"))
			.appendField("set gravity to")
			.appendField(new Blockly.FieldNumber(), "VALUE")
		this.setColour(colors.query)
		this.setTooltip("Set gravity")
		this.setHelpUrl("https://kaboomjs.com#gravity")
	},
}

js["kaboom_gravity"] = (block: Block) => {
	const value = block.getFieldValue("VALUE")
	return `gravity(${value})`
}

Blockly.Blocks["kaboom_onUpdate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("every frame")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every frame")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdate"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `onUpdate(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onUpdateTag"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("every frame for tag")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every frame for all objects with a tag")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdateTag"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `onUpdate("${tag}", (obj) => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onKey"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("key"))
			.appendField("when key")
			.appendField(new Blockly.FieldDropdown(KEYS.map((k) => [k, k])), "KEY")
			.appendField("is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onKeyPress" ],
				[ "held down", "onKeyDown" ],
				[ "released", "onKeyRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when a key is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onKeyPress")
	},
}

js["kaboom_onKey"] = (block: Block) => {
	const key = block.getFieldValue("KEY")
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}("${key}", () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onMouse"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("mouse"))
			.appendField("when mouse is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onMousePress" ],
				[ "held down", "onMouseDown" ],
				[ "released", "onMouseRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when mouse is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onMousePress")
	},
}

js["kaboom_onMouse"] = (block: Block) => {
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onObj"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("when")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("is")
			.appendField(new Blockly.FieldDropdown([
				[ "clicked", "onClick" ],
				[ "hovered", "onHover" ],
				[ "grounded", "onGround" ],
				[ "destroy", "onDestroy" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when object is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onObj"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const event = block.getFieldValue("EVENT")
	return `${obj}.${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onCollide"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("collide"))
			.appendField("when")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("collides with a")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something when object is collided with another object with a tag")
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onCollide"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `${obj}.onCollide("${tag}", (obj) => {\n${action}\n})`
}

Blockly.Blocks["kaboom_loop"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("timer"))
			.appendField("every")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every n seconds")
		this.setHelpUrl("https://kaboomjs.com#loop")
	},
}

js["kaboom_loop"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `loop(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_wait"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("timer"))
			.appendField("after")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something after n seconds")
		this.setHelpUrl("https://kaboomjs.com#wait")
	},
}

js["kaboom_wait"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `wait(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_shake"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(icon("shake"))
			.appendField("shake")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
		this.setTooltip("Screen shake")
		this.setHelpUrl("https://kaboomjs.com#shake")
	},
}

js["kaboom_shake"] = () => {
	return "shake()"
}

Blockly.Blocks["kaboom_play"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("play sound")
			.appendField(new Blockly.FieldTextInput(), "NAME")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
		this.setTooltip("Screen shake")
		this.setHelpUrl("https://kaboomjs.com#shake")
	},
}

js["kaboom_play"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	return `play(${name})`
}

Blockly.Blocks["kaboom_dt"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField("delta time")
		this.setOutput(true, "Number")
		this.setColour(colors.query)
		this.setTooltip("Delta time between frame")
		this.setHelpUrl("https://kaboomjs.com#dt")
	},
}

js["kaboom_dt"] = () => {
	return "dt()"
}
