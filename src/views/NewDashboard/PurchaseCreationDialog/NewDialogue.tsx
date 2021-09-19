import currency from 'currency.js';
import { Benefactor, User } from 'src/models/Budget';

interface DialogueProps {
  benefactors: Benefactor[];
  defaultMode?: 'even-split' | 'saldo';
  total: number;
  onBenefactorsChanged: (benefactors: Benefactor[]) => void;
}

export const Dialogue = ({
  benefactors,
  onBenefactorsChanged,
  total,
}: DialogueProps) => {
  const onAmountChanged = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    const currentValue = benefactors.find((e) => e.user._id === name)
      ?.amountBenefitted as number;
    let diff = value - currentValue;
    const totalNumberMembers = benefactors.length - 1;
    const divided = currency(diff).distribute(totalNumberMembers);
    let i = -1;

    console.log('diff', diff);
    onBenefactorsChanged(
      benefactors.map((b) => {
        if (b.user._id === name) {
          return {
            ...b,
            amountBenefitted: value,
          };
        } else {
          i++;
          return {
            ...b,
            amountBenefitted: currency(b.amountBenefitted - divided[i].value)
              .value,
          };
        }
      })
    );
  };

  return (
    <div>
      {benefactors.map((b) => (
        <div>
          {b.user.name}
          <input
            name={b.user._id}
            type='range'
            value={b.amountBenefitted}
            min={0}
            step={0.1}
            max={total}
            onChange={onAmountChanged}
          />
          {b.amountBenefitted}
        </div>
      ))}
    </div>
  );
};

export const initBenefactors = (
  members: User[],
  amount: number,
  defaultMode: 'even-split' | 'saldo',
  payerId: string
): any[] => {
  if (defaultMode === 'saldo' && members.length > 2) {
    return [];
  }

  if (defaultMode === 'saldo') {
    return members.map((m) => {
      return {
        user: m,
        amountPaid: payerId === m._id ? amount : 0,
        amountBenefitted: payerId !== m._id ? amount : 0,
      };
    });
  } else {
    const evenDivided = currency(amount).distribute(members.length);
    return members.map((m, index) => {
      return {
        user: m,
        amountPaid: payerId === m._id ? amount : 0,
        amountBenefitted: evenDivided[index].value,
      };
    });
  }
};
