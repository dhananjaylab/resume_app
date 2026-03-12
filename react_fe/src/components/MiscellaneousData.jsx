import { Tag } from "primereact/tag";

const MiscellaneousData = ({ data }) => {

    const miscellaneousItems = Array.isArray(data?.miscellaneous) ? data.miscellaneous : [];
    if (miscellaneousItems.length === 0) {
        return <div style={{ textAlign: 'center' }}>No Miscellaneous Data Available</div>;
    }

    return (
        <>
            <div
                style={{
                    width: "80vw",
                    overflowY: "auto",
                }}
            >
                {miscellaneousItems.map((items) => (
                    <Tag key={items}
                        value={items}
                        style={{
                            background: '#fff',
                            color: '#1a4879',
                            borderRadius: '10px',
                            padding: '4px 28px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                        }}
                        className="mr-3 mb-2" />
                ))
                }
            </div>
        </>
    );
}

export default MiscellaneousData;