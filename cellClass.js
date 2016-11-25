function Cell(){
  tCell = new Sprite(game, "blank.png", 20, 20);
  tCell.setSpeed(0);
  tCell.state = BLANK;

  tCell.images = new Array("blank.png", "goBlackPiece.png", "goWhitePiece.png");

  return tCell;
} // end cell
