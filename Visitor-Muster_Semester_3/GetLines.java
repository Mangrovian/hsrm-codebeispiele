import java.awt.*;
import java.util.ArrayList;

public class GetLines implements Visitor{

    ArrayList<Line> lines;

    public GetLines(ArrayList<Line> lines) {
        this.lines = lines;
    }

    @Override
    public void visit(Line l) {
        lines.add(l);
    }
}
//v.visit(this);