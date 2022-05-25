public class CountRectangles implements Visitor{

    int summe;

    public CountRectangles(int summe) {
        this.summe = summe;
    }

    @Override
    public void visit(Rectangle r) {
        summe++;
    }

}
