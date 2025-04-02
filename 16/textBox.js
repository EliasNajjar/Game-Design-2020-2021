class TextBox extends GameObject
{
    constructor(x, y, w, h, text)
    {
        super();
        this.boxText = new Rectangle(x, y, w, h)
        this.text = text;
        this.textLines = [];
        this.textSize = 20;
        this.letterCap = w/(this.textSize/2);
        this.setText(text);
    }
    setText(text)
    {
        let space = text.split(" ");
        let buffer = "";
        for(let i = 0;i < space.length;i++)
        {
            if((buffer + " " + space[i]).length <= this.letterCap)
            {
                buffer += " " + space[i];
                
            }
            else
            {
                this.textLines.push(buffer);
                buffer = space[i];
            }
        }
        if(buffer.length > 0)
        {
            this.textLines.push(buffer);
        }
    }
    toRender(draw)
    {
        draw.beginPath();
        draw.rect(this.boxText.topLeft.x, 
                    this.boxText.topLeft.y,  
                    this.boxText.w, 
                    this.boxText.h);
        draw.stroke();
        draw.fillStyle = "#420069";
        draw.font = this.textSize + "px Georgia";
        for(let i = 0;i < this.textLines.length;i++)
        {
            draw.fillText(this.textLines[i],
                 this.boxText.topLeft.x,
                 this.boxText.topLeft.y + this.textSize + (i * this.textSize));
        }
        
    }
}