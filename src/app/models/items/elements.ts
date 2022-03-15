export enum Element {
  fire,
  earth,
  metal,
  water,
  wood
}

export class ElementMaps {
  public static buff: Map<Element, Element> = new Map<Element, Element>([
    [Element.fire, Element.earth],
    [Element.earth, Element.metal],
    [Element.metal, Element.water],
    [Element.water, Element.wood],
    [Element.wood, Element.fire]
  ])
  public static weaken: Map<Element, Element> = new Map<Element, Element>([
    [Element.fire, Element.metal],
    [Element.earth, Element.water],
    [Element.metal, Element.wood],
    [Element.water, Element.fire],
    [Element.wood, Element.earth]
  ])
  public static display: Map<Element, string> = new Map<Element, string>([
    [Element.fire, "Fire"],
    [Element.earth, "Earth"],
    [Element.metal, "Metal"],
    [Element.water, "Water"],
    [Element.wood, "Wood"]
  ])
}
